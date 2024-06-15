use crate::abstraction::{Api, GenerateW, Test, VerifyType};
use crate::error::{
    missing_param, net_work_error, other, other_without_source, parse_error, Result,
};
use image::{GenericImage, ImageFormat};
use reqwest::blocking::Client;
use serde_json::Value;
use std::collections::HashMap;
use std::io::Cursor;
use mini_v8::{Function, MiniV8};

pub struct Slide {
    client: Client,
    verify_type: VerifyType,
}

impl Default for Slide {
    fn default() -> Self {
        Slide {
            client: Client::new(),
            verify_type: VerifyType::Slide,
        }
    }
}
impl Api for Slide {
    /// (new_challenge, 完整背景图url, 缺口背景图url, 滑块图url)
    type ArgsType = (String, String, String, String);
    fn get_new_c_s_args(
        &self,
        gt: &str,
        challenge: &str,
    ) -> Result<(Vec<u8>, String, Self::ArgsType)> {
        let url = "http://api.geevisit.com/get.php";
        let mut params = HashMap::from([
            ("gt", gt),
            ("challenge", challenge),
            ("is_next", "true"),
            ("offline", "false"),
            ("isPC", "true"),
            ("callback", "geetest_1717915671544"),
        ]);
        params.insert(
            "type",
            match self.verify_type {
                VerifyType::Click => "click",
                VerifyType::Slide => "slide",
            },
        );
        let res = self
            .client
            .get(url)
            .query(&params)
            .send()
            .map_err(net_work_error)?;
        let res = res.text().map_err(|e| other("什么b玩意错误", e))?;
        let res = res
            .strip_prefix("geetest_1717915671544(")
            .ok_or_else(|| other_without_source("前缀错误"))?
            .strip_suffix(")")
            .ok_or_else(|| other_without_source("后缀错误"))?;
        let res: Value = serde_json::from_str(res).map_err(parse_error)?;
        let c: Vec<u8> =
            serde_json::from_value(res.get("c").ok_or_else(|| missing_param("c"))?.clone())
                .map_err(parse_error)?;
        let static_server = res
            .get("static_servers")
            .ok_or_else(|| missing_param("static_servers"))?
            .as_array()
            .ok_or_else(|| missing_param("static_servers"))?
            .get(0)
            .ok_or_else(|| other_without_source("static_servers里面咋没东西啊"))?
            .as_str()
            .ok_or_else(|| other_without_source("static_servers里面咋没东西啊"))?;
        Ok((
            c,
            res.get("s").expect("没有s").as_str().unwrap().to_string(),
            (
                res.get("challenge")
                    .ok_or_else(|| missing_param("challenge"))?
                    .as_str()
                    .ok_or_else(|| missing_param("challenge"))?
                    .to_string(),
                format!(
                    "https://{}{}",
                    static_server,
                    res.get("fullbg")
                        .ok_or_else(|| missing_param("fullbg"))?
                        .as_str()
                        .ok_or_else(|| missing_param("fullbg"))?
                ),
                format!(
                    "https://{}{}",
                    static_server,
                    res.get("bg")
                        .ok_or_else(|| missing_param("bg"))?
                        .as_str()
                        .ok_or_else(|| missing_param("bg"))?
                ),
                format!(
                    "https://{}{}",
                    static_server,
                    res.get("slice")
                        .ok_or_else(|| missing_param("slice"))?
                        .as_str()
                        .ok_or_else(|| missing_param("slice"))?
                ),
            ),
        ))
    }

    fn verify(&self, gt: &str, challenge: &str, w: Option<&str>) -> Result<(String, String)> {
        let url = "http://api.geevisit.com/ajax.php";
        let mut params = HashMap::from([
            ("gt", gt),
            ("challenge", challenge),
            ("callback", "geetest_1717918222610"),
        ]);
        if let Some(w) = w {
            params.insert("w", w);
        }
        let res = self
            .client()
            .get(url)
            .query(&params)
            .send()
            .map_err(net_work_error)?;
        let res = res.text().unwrap();
        let res = res
            .strip_prefix("geetest_1717918222610(")
            .ok_or_else(|| other_without_source("前缀错误"))?
            .strip_suffix(")")
            .ok_or_else(|| other_without_source("后缀错误"))?;
        let res: Value = serde_json::from_str(res).unwrap();
        Ok((
            res.get("message")
                .ok_or_else(|| missing_param("message"))?
                .as_str()
                .ok_or_else(|| missing_param("message"))?
                .to_string(),
            res.get("validate")
                .ok_or_else(|| missing_param("validate"))?
                .as_str()
                .ok_or_else(|| missing_param("validate"))?
                .to_string(),
        ))
    }

    fn refresh(&self, _gt: &str, _challenge: &str) -> Result<Self::ArgsType> {
        todo!("{}", "暂时不写")
    }

    fn client(&self) -> &Client {
        &self.client
    }
}

impl GenerateW for Slide {
    /// ### 计算滑块的关键参数
    /// #### 返回值
    /// - dis
    fn calculate_key(&mut self, args: Self::ArgsType) -> Result<String> {
        let (_, _, bg, slice) = args;
        let bg_img = self.download_img(bg.as_str())?;
        let slice_img = self.download_img(slice.as_str())?;
        //还原背景图
        let bg_img = image::load_from_memory(&bg_img).map_err(|e| other("图片解析错误", e))?;
        let mut new_bg_img = image::ImageBuffer::new(260, 160);
        let offset = [
            39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30,
            44, 45, 43, 42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1, 11, 10,
            4, 5, 19, 18, 16, 17,
        ];
        let w_sep = 10;
        let h_sep = 80;
        for idx in 0..52 {
            let x = offset[idx] % 26 * 12;
            let y = if offset[idx] > 25 { h_sep } else { 0 };
            let new_x = idx % 26 * 10;
            let new_y = if idx > 25 { h_sep } else { 0 };
            let pi = bg_img.crop_imm(x, y, w_sep, h_sep);
            new_bg_img.copy_from(&pi, new_x as u32, new_y).unwrap();
        }
        let mut bytes = Cursor::new(Vec::new());
        new_bg_img.write_to(&mut bytes, ImageFormat::Png).unwrap();
        let res_x = ddddocr::slide_match(slice_img, bytes.into_inner())
            .map_err(|e| other("ddddocr出错", e))?
            .x1;
        Ok(res_x.to_string())
    }

    fn generate_w(
        &self,
        key: &str,
        gt: &str,
        challenge: &str,
        c: &str,
        s: &str,
        rt: &str,
    ) -> Result<String> {
        let slide_w: Function = MiniV8::new().eval(include_str!("../js/slide.js")).map_err(|_| other_without_source("js运行时创建失败"))?;
        slide_w.call((key, gt, challenge, c, s, rt)).map_err(|_| other_without_source("js运行时出错"))
    }
}

impl Test for Slide {
    fn test(&mut self, url: &str) -> Result<String> {
        let rt = "82253e788a7b95e9";
        let (gt, mut challenge) = self.register_test(url)?;
        let (_, _) = self.get_c_s(gt.as_str(), challenge.as_str(), None)?;
        let _ = self.get_type(gt.as_str(), challenge.as_str(), None)?;
        let (c, s, args) = self.get_new_c_s_args(gt.as_str(), challenge.as_str())?;
        challenge = args.0.clone();
        let key = self.calculate_key(args)?;
        let w = self.generate_w(
            key.as_str(),
            gt.as_str(),
            challenge.as_str(),
            serde_json::to_string(&c).unwrap().as_str(),
            s.as_str(),
            rt,
        )?;
        let (_, validate) =
            self.verify(gt.as_str(), challenge.as_str(), Option::from(w.as_str()))?;
        Ok(validate)
    }
}
