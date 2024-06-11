use std::collections::HashMap;
use std::io::Cursor;
use std::process::Command;
use ddddocr::{BBox, CharsetRange, Ddddocr};
use image::{GenericImage, ImageFormat};
use reqwest::blocking::Client;
use serde_json::Value;
use crate::abstraction::{Api, GenerateW, Test, VerifyType};

pub struct Slide {
    client: Client,
    verify_type: VerifyType
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
    fn get_new_c_s_args(&self, gt: &str, challenge: &str) -> (Vec<u8>, String, Self::ArgsType) {
        let url = "http://api.geevisit.com/get.php";
        let mut params = HashMap::from([("gt", gt), ("challenge", challenge), ("is_next", "true"),
            ("offline", "false"), ("isPC", "true"), ("callback", "geetest_1717915671544")]);
        params.insert("type", match self.verify_type { VerifyType::Click => "click", VerifyType::Slide => "slide" });
        let res = self.client.get(url).query(&params).send().unwrap();
        let res = res.text().unwrap();
        let res = res.strip_prefix("geetest_1717915671544(").unwrap().strip_suffix(")").unwrap();
        let res: Value = serde_json::from_str(res).unwrap();
        let c: Vec<u8> = serde_json::from_value(res.get("c").expect("没有c").clone()).unwrap();
        let static_server = res.get("static_servers").unwrap().as_array().unwrap().get(0).unwrap().as_str().unwrap();
        (c,
         res.get("s").expect("没有s").as_str().unwrap().to_string(),
         (res.get("challenge").expect("没有challenge").as_str().unwrap().to_string(),
          format!("https://{}{}", static_server, res.get("fullbg").unwrap().as_str().unwrap()),
          format!("https://{}{}", static_server, res.get("bg").unwrap().as_str().unwrap()),
          format!("https://{}{}", static_server, res.get("slice").unwrap().as_str().unwrap()),
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
    fn calculate_key(&mut self, args: Self::ArgsType) -> String {
        let (_, _, bg, slice) = args;
        let bg_img = self.download_img(bg.as_str());
        let slice_img = self.download_img(slice.as_str());
        //还原背景图
        let bg_img = image::load_from_memory(&bg_img).unwrap();
        let mut new_bg_img = image::ImageBuffer::new(260, 160);
        let offset = [39, 38, 48, 49, 41, 40, 46, 47, 35, 34, 50, 51, 33, 32, 28, 29, 27, 26, 36, 37, 31, 30, 44, 45, 43,
            42, 12, 13, 23, 22, 14, 15, 21, 20, 8, 9, 25, 24, 6, 7, 3, 2, 0, 1, 11, 10, 4, 5, 19, 18, 16, 17];
        let w_sep = 10;
        let h_sep = 80;
        for idx in 0..52 {
            let x = offset[idx] % 26 * 12;
            let y = if offset[idx] > 25 { h_sep } else { 0 };
            let new_x = idx % 26 * 10;
            let new_y = if idx > 25 { h_sep } else {0};
            let pi = bg_img.crop_imm(x, y, w_sep, h_sep);
            new_bg_img.copy_from(&pi, new_x as u32, new_y).unwrap();
        }
        let mut bytes= Cursor::new(Vec::new());
        new_bg_img.write_to(&mut bytes, ImageFormat::Png).unwrap();
        let res_x = ddddocr::slide_match(slice_img, bytes.into_inner()).unwrap().x1;
        return res_x.to_string();
    }

    fn generate_w(&self, key: &str, gt: &str, challenge: &str, c: &str, s: &str, rt: &str) -> String {
        let params = vec![key, gt, challenge, c, s, rt];
        let out_put = Command::new(".\\slide.exe").args(&params).output().unwrap();
        return String::from_utf8_lossy(&out_put.stdout).to_string();
    }
}

impl Test for Slide {
    fn test(&mut self, url: &str) {
        let rt = "82253e788a7b95e9";
        let (gt, mut challenge) = self.register_test(url);
        let (_, _) = self.get_c_s(gt.as_str(), challenge.as_str(), None);
        let _ = self.get_type(gt.as_str(), challenge.as_str(), None);
        let (c, s, args) = self.get_new_c_s_args(gt.as_str(), challenge.as_str());
        challenge = args.0.clone();
        let key = self.calculate_key(args);
        let w = self.generate_w(key.as_str(), gt.as_str(), challenge.as_str(),
                                serde_json::to_string(&c).unwrap().as_str(), s.as_str(), rt);
        let res = self.verify(gt.as_str(), challenge.as_str(), Option::from(w.as_str()));
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

    fn register_test(&self, url: &str) -> (String, String) {
        let res = self.client().get(url).send().unwrap();
        let res = res.json::<Value>().expect("解析失败");
        let res = res.get("data").unwrap().get("geetest").unwrap();
        (res.get("gt").unwrap().as_str().unwrap().to_string(),
         res.get("challenge").unwrap().as_str().unwrap().to_string())
    }
    fn get_new_c_s_args(&self, gt: &str, challenge: &str) -> (Vec<u8>, String, Self::ArgsType) {
        let url = "http://api.geevisit.com/get.php";
        let mut params = HashMap::from([("gt", gt), ("challenge", challenge), ("is_next", "true"),
            ("offline", "false"), ("isPC", "true"), ("callback", "geetest_1717915671544")]);
        params.insert("type", match self.verify_type { VerifyType::Click => "click", VerifyType::Slide => "slide" });
        let res = self.client.get(url).query(&params).send().unwrap();
        let res = res.text().unwrap();
        let res = res.strip_prefix("geetest_1717915671544(").unwrap().strip_suffix(")").unwrap();
        let res: Value = serde_json::from_str(res).unwrap();
        let res = res.get("data").expect("没有data");
        let c: Vec<u8> = serde_json::from_value(res.get("c").expect("没有c").clone()).unwrap();
        let static_server = res.get("static_servers").unwrap().as_array().unwrap().get(0).unwrap().as_str().unwrap();
        (c,
         res.get("s").expect("没有s").as_str().unwrap().to_string(),
         format!("https://{}{}", static_server, res.get("pic").unwrap().as_str().unwrap().strip_prefix("/").unwrap())
        )
    }


    fn verify(&self, gt: &str, challenge: &str, w: Option<&str>) -> (String, String) {
        let url = "http://api.geevisit.com/ajax.php";
        let mut params = HashMap::from([("gt", gt), ("challenge", challenge),
            ("callback", "geetest_1717918222610")]);
        if let Some(w) = w {
            params.insert("w", w);
        }
        let res = self.client().get(url).query(&params).send().unwrap();
        let res = res.text().unwrap();
        let res = res.strip_prefix("geetest_1717918222610(").unwrap().strip_suffix(")").unwrap();
        let res: Value = serde_json::from_str(res).unwrap();
        println!("{:?}", res);
        let res = res.get("data").unwrap();
        println!("{:?}", res);
        (res.get("result").expect("没有result").as_str().unwrap().to_string(),
         res.get("validate").expect("没有validate").as_str().unwrap().to_string())
    }

    fn client(&self) -> &Client {
        &self.client
    }
}

impl GenerateW for Click<'_> {
    /// ### 计算滑块的关键参数
    /// #### 返回值
    /// - positions
    // fn calculate_key(&mut self, args: Self::ArgsType) -> String {
    //     let pic_url = args;
    //     let pic_img = self.download_img(pic_url.as_str());
    //     let pic_img = image::io::Reader::new(Cursor::new(pic_img)).with_guessed_format().unwrap().decode().unwrap();
    //     pic_img.save("./pic.png").unwrap();
    //     let bg_img = pic_img.crop_imm(0, 0, 344, 344);
    //     let text_img = pic_img.crop_imm(0, 345, 116, 40);
    //     let mut text = Vec::new();
    //     //目标检测+识别背景图中文字
    //     let mut bg_bytes = Cursor::new(Vec::new());
    //     bg_img.write_to(&mut bg_bytes, ImageFormat::Png).unwrap();
    //     let bg_det = self.det.detection(bg_bytes.into_inner()).expect("ddddocr内部错误");
    //     for det in &bg_det {
    //         let new_img = bg_img.crop_imm(det.x1, det.y1, det.x2 - det.x1, det.y2 - det.y1);
    //         let mut new_bytes = Cursor::new(Vec::new());
    //         new_img.write_to(&mut new_bytes, ImageFormat::Png).unwrap();
    //         self.ocr.set_ranges(CharsetRange::DefaultCharsetLowercaseUppercaseDigit);
    //         let c = self.ocr.classification(new_bytes.into_inner(), false).expect("ddddocr内部错误");
    //         text.push(c);
    //     }
    //     let text = text.join("");
    //
    //     //识别题目文字
    //     let mut text_bytes = Cursor::new(Vec::new());
    //     text_img.write_to(&mut text_bytes, ImageFormat::Png).unwrap();
    //     self.ocr.set_ranges(CharsetRange::Other(text.clone()));
    //     let s = self.ocr.classification_probability(text_bytes.into_inner(), false).expect("ddddocr内部错误").get_text();
    //     let mut res = Vec::new();
    //     println!("{}", text);
    //     println!("{}", s);
    //     for c in s.chars() {
    //         println!("{}", c);
    //         let mut idx = None;
    //         for (i, cc) in text.chars().enumerate() {
    //             if cc == c {
    //                 idx = Some(i);
    //                 break;
    //             }
    //         }
    //         println!("{:?}", idx);
    //         println!("{:?}", bg_det);
    //         let bbox = bg_det.get(idx.unwrap()).expect("未知错误");
    //         let x = (bbox.x1 + bbox.x2)/2;
    //         let y = (bbox.y1 + bbox.y2)/2;
    //         let position = format!("{}_{}", (x as f64 / 333.375 * 100f64 * 100f64).round() , (y as f64 / 333.375 * 100f64 * 100f64).round());
    //         res.push(position);
    //     }
    //     res.join(",")
    // }

    fn calculate_key(&mut self, args: Self::ArgsType) -> String {
        let pic_url = args;
        let pic_img = self.download_img(pic_url.as_str());
        let pic_img = image::load_from_memory(&pic_img).unwrap();
        let bg_img = pic_img.crop_imm(0, 0, 344, 344);
        let text_img = pic_img.crop_imm(0, 345, 116, 40);
        let mut text = Vec::with_capacity(2);

        //识别题目文字
        let mut text_bytes = Cursor::new(Vec::new());
        text_img.write_to(&mut text_bytes, ImageFormat::Png).unwrap();
        self.ocr.set_ranges(CharsetRange::DefaultCharsetLowercaseUppercaseDigit);
        let s = self.ocr.classification_probability(text_bytes.into_inner(), false).expect("ddddocr内部错误").get_text();

        //目标检测+识别背景图中文字
        let mut bg_bytes = Cursor::new(Vec::new());
        bg_img.write_to(&mut bg_bytes, ImageFormat::Png).unwrap();
        let bg_det = self.det.detection(bg_bytes.into_inner()).expect("ddddocr内部错误");
        for det in &bg_det {
            let new_img = bg_img.crop_imm(det.x1, det.y1, det.x2 - det.x1, det.y2 - det.y1);
            let mut new_bytes = Cursor::new(Vec::new());
            new_img.write_to(&mut new_bytes, ImageFormat::Png).unwrap();
            self.ocr.set_ranges(CharsetRange::Other(s.clone()));
            let c = self.ocr.classification_probability(new_bytes.into_inner(), false).expect("ddddocr内部错误");
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
                let idx= s.chars().position(|x| &x.to_string() == c);
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
            let x = (bbox.x1 + bbox.x2)/2;
            let y = (bbox.y1 + bbox.y2)/2;
            let position = format!("{}_{}", (x as f64 / 333.375 * 100f64 * 100f64).round() , (y as f64 / 333.375 * 100f64 * 100f64).round());
            res.push(position);
        }
        res.join(",")
    }

    fn generate_w(&self, key: &str, gt: &str, challenge: &str, c: &str, s: &str, rt: &str) -> String {
        let params = vec![key, gt, challenge, c, s, rt];
        let out_put = Command::new(".\\click.exe").args(&params).output().unwrap();
        return String::from_utf8_lossy(&out_put.stdout).to_string();
    }
}

impl Test for Click<'_>{}