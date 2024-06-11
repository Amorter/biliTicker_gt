use crate::abstraction::{Api, GenerateW, Test, VerifyType};
use crate::error::{
    missing_param, net_work_error, other, other_without_source, parse_error, Result,
};
use ddddocr::{BBox, CharsetRange, Ddddocr};
use image::{GenericImage, ImageFormat};
use reqwest::blocking::Client;
use serde_json::Value;
use std::collections::HashMap;
use std::io::Cursor;
use std::process::Command;

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
        let params = vec![key, gt, challenge, c, s, rt];
        let out_put = Command::new(".\\slide.exe")
            .args(&params)
            .output()
            .map_err(|e| other("slide.exe命令行错误", e))?;
        Ok(String::from_utf8_lossy(&out_put.stdout).to_string())
    }
}

impl Test for Slide {
    fn test(&mut self, url: &str) {
        let rt = "82253e788a7b95e9";
        let (gt, mut challenge) = self.register_test(url).unwrap();
        let (_, _) = self.get_c_s(gt.as_str(), challenge.as_str(), None).unwrap();
        let _ = self.get_type(gt.as_str(), challenge.as_str(), None);
        let (c, s, args) = self
            .get_new_c_s_args(gt.as_str(), challenge.as_str())
            .unwrap();
        challenge = args.0.clone();
        let key = self.calculate_key(args).unwrap();
        let w = self
            .generate_w(
                key.as_str(),
                gt.as_str(),
                challenge.as_str(),
                serde_json::to_string(&c).unwrap().as_str(),
                s.as_str(),
                rt,
            )
            .unwrap();
        let res = self
            .verify(gt.as_str(), challenge.as_str(), Option::from(w.as_str()))
            .unwrap();
        println!("{:?}", res);
    }
}

pub struct Click<'a> {
    client: Client,
    verify_type: VerifyType,
    ocr: Ddddocr<'a>,
    det: Ddddocr<'a>,
}
impl Default for Click<'_> {
    fn default() -> Self {
        Click {
            client: Client::new(),
            verify_type: VerifyType::Click,
            ocr: ddddocr::ddddocr_classification().unwrap(),
            det: ddddocr::ddddocr_detection().unwrap(),
        }
    }
}
impl Api for Click<'_> {
    type ArgsType = String;

    fn register_test(&self, url: &str) -> Result<(String, String)> {
        let res = self.client().get(url).send().map_err(net_work_error)?;
        let res = res.json::<Value>().expect("解析失败");
        let res = res
            .get("data")
            .ok_or_else(|| missing_param("data"))?
            .get("geetest")
            .ok_or_else(|| missing_param("geetest"))?;
        Ok((
            res.get("gt")
                .ok_or_else(|| missing_param("gt"))?
                .as_str()
                .ok_or_else(|| missing_param("gt"))?
                .to_string(),
            res.get("challenge")
                .ok_or_else(|| missing_param("challenge"))?
                .as_str()
                .ok_or_else(|| missing_param("challenge"))?
                .to_string(),
        ))
    }

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
        let res = res.get("data").ok_or_else(|| missing_param("data"))?;
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
            res.get("s")
                .ok_or_else(|| missing_param("s"))?
                .as_str()
                .ok_or_else(|| missing_param("s"))?
                .to_string(),
            format!(
                "https://{}{}",
                static_server,
                res.get("pic")
                    .ok_or_else(|| missing_param("pic"))?
                    .as_str()
                    .ok_or_else(|| missing_param("pic"))?
                    .strip_prefix("/")
                    .ok_or_else(|| other_without_source("我真不想编错误名了"))?
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
        let res = res.text().map_err(|e| other("什么b玩意错误", e))?;
        let res = res
            .strip_prefix("geetest_1717918222610(")
            .ok_or_else(|| other_without_source("前缀错误"))?
            .strip_suffix(")")
            .ok_or_else(|| other_without_source("后缀错误"))?;
        let res: Value = serde_json::from_str(res).map_err(parse_error)?;
        println!("{:?}", res);
        let res = res.get("data").ok_or_else(|| missing_param("data"))?;
        println!("{:?}", res);
        Ok((
            res.get("result")
                .ok_or_else(|| missing_param("result"))?
                .as_str()
                .ok_or_else(|| missing_param("result"))?
                .to_string(),
            res.get("validate")
                .ok_or_else(|| missing_param("validate"))?
                .as_str()
                .ok_or_else(|| missing_param("validate"))?
                .to_string(),
        ))
    }

    fn client(&self) -> &Client {
        &self.client
    }
}

impl GenerateW for Click<'_> {
    /// ### 计算滑块的关键参数
    /// #### 返回值
    /// - positions
    fn calculate_key(&mut self, args: Self::ArgsType) -> Result<String> {
        let pic_url = args;
        let pic_img = self.download_img(pic_url.as_str())?;
        let pic_img = image::load_from_memory(&pic_img).map_err(|e| other("图片加载失败", e))?;
        let bg_img = pic_img.crop_imm(0, 0, 344, 344);
        let text_img = pic_img.crop_imm(0, 345, 116, 40);
        let mut text = Vec::with_capacity(2);

        //识别题目文字
        let mut text_bytes = Cursor::new(Vec::new());
        text_img
            .write_to(&mut text_bytes, ImageFormat::Png)
            .unwrap();
        self.ocr
            .set_ranges(CharsetRange::DefaultCharsetLowercaseUppercaseDigit);
        let s = self
            .ocr
            .classification_probability(text_bytes.into_inner(), false)
            .expect("ddddocr内部错误")
            .get_text();

        //目标检测+识别背景图中文字
        let mut bg_bytes = Cursor::new(Vec::new());
        bg_img.write_to(&mut bg_bytes, ImageFormat::Png).unwrap();
        let bg_det = self
            .det
            .detection(bg_bytes.into_inner())
            .expect("ddddocr内部错误");
        for det in &bg_det {
            let new_img = bg_img.crop_imm(det.x1, det.y1, det.x2 - det.x1, det.y2 - det.y1);
            let mut new_bytes = Cursor::new(Vec::new());
            new_img.write_to(&mut new_bytes, ImageFormat::Png).unwrap();
            self.ocr.set_ranges(CharsetRange::Other(s.clone()));
            let c = self
                .ocr
                .classification_probability(new_bytes.into_inner(), false)
                .expect("ddddocr内部错误");
            text.push(c);
        }

        //求检测出来包含在题目中的最大可能性
        let mut max_vec = vec![(1, 0f32); s.chars().count()];
        //检测的可能性
        for (idx_cp, cp) in text.iter().enumerate() {
            let mut pos = Vec::with_capacity(s.len());
            //charset中的字符
            for c in &cp.charset {
                //在题目中的位置
                let idx = s.chars().position(|x| &x.to_string() == c);
                pos.push(idx);
            }

            for pb in &cp.probability {
                for (i, p) in pb.iter().enumerate() {
                    if let Some(i) = pos[i] {
                        if max_vec[i].1 < *p {
                            max_vec[i].1 = *p;
                            max_vec[i].0 = idx_cp;
                        }
                    }
                }
            }
        }

        //遍历题目
        let mut res = Vec::with_capacity(s.chars().count());
        for (idx, _) in max_vec {
            let bbox: &BBox = bg_det.get(idx).expect("未知错误");
            let x = (bbox.x1 + bbox.x2) / 2;
            let y = (bbox.y1 + bbox.y2) / 2;
            let position = format!(
                "{}_{}",
                (x as f64 / 333.375 * 100f64 * 100f64).round(),
                (y as f64 / 333.375 * 100f64 * 100f64).round()
            );
            res.push(position);
        }
        Ok(res.join(","))
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
        let params = vec![key, gt, challenge, c, s, rt];
        let out_put = Command::new(".\\click.exe")
            .args(&params)
            .output()
            .map_err(|e| other("click.exe命令行错误", e))?;
        Ok(String::from_utf8_lossy(&out_put.stdout).to_string())
    }
}

impl Test for Click<'_> {}
