use std::collections::HashMap;
use std::thread::sleep;
use std::time::Duration;
use reqwest::blocking::Client;
use serde_json::Value;
pub(crate) enum VerifyType {
    Slide,
    Click
}


pub(crate) trait Api {
    type ArgsType;
    /// ### 申请验证码
    /// #### 返回值
    /// - gt
    /// - challenge
    fn register_test(&self, url: &str) -> (String, String) {
        let res = self.client().get(url).send().unwrap();
        let res = res.json::<Value>().expect("解析失败");
        (res.get("gt").unwrap().as_str().unwrap().to_string(),
         res.get("challenge").unwrap().as_str().unwrap().to_string())
    }
    /// ### 获取c和s参数
    /// #### 返回值
    /// - c
    /// - s
    fn get_c_s(&self, gt: &str, challenge: &str, w: Option<&str>) -> (Vec<u8>, String) {
        let url = "https://api.geetest.com/get.php";
        let mut params = HashMap::from([("gt", gt), ("challenge", challenge),
            ("callback", "geetest_1717911889779")]);
        if let Some(w) = w {
            params.insert("w", w);
        }
        let res = self.client().get(url).query(&params).send().unwrap();
        let res = res.text().unwrap();
        let res = res.strip_prefix("geetest_1717911889779(").unwrap().strip_suffix(")").unwrap();
        let res: Value = serde_json::from_str(res).unwrap();
        let data = res.get("data").expect("没有data");
        let c: Vec<u8> = serde_json::from_value(data.get("c").unwrap().clone()).unwrap();
        (c,
         data.get("s").unwrap().as_str().unwrap().to_string())
    }
    /// ### 获取验证码类型
    /// #### 返回值
    /// - 验证码类型
    fn get_type(&self, gt: &str, challenge: &str, w: Option<&str>) -> VerifyType {
        let url = "http://api.geevisit.com/ajax.php";
        let mut params = HashMap::from([("gt", gt), ("challenge", challenge),
            ("callback", "geetest_1717934072177")]);
        if let Some(w) = w {
            params.insert("w", w);
        }
        let res = self.client().get(url).query(&params).send().unwrap();
        let res = res.text().unwrap();
        let res = res.strip_prefix("geetest_1717934072177(").unwrap().strip_suffix(")").unwrap();
        let res: Value = serde_json::from_str(res).unwrap();
        let data = res.get("data").expect("没有data");
        let result = data.get("result").expect("没有result").as_str().unwrap();
        match result {
            "slide" => VerifyType::Slide,
            "click" => VerifyType::Click,
            _ => panic!("未知类型")
        }
    }
    /// ### 获取新的c,s,challenge参数和验证所需要的参数
    /// #### 返回值
    /// - c
    /// - s
    /// - challenge
    /// - args(不定数目)
    fn get_new_c_s_args(&self, gt: &str, challenge: &str) -> (Vec<u8>, String, Self::ArgsType);
    /// ### 验证
    /// #### 返回值
    /// - message
    /// - validate
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
        (res.get("message").expect("没有message").as_str().unwrap().to_string(),
         res.get("validate").expect("没有validate").as_str().unwrap().to_string())
    }
    /// ### 下载图片
    /// #### 返回值
    /// - img
    fn download_img(&self, img_url: &str) -> Vec<u8> {
        let res = self.client().get(img_url).send().unwrap();
        res.bytes().unwrap().to_vec()
    }

    fn client(&self) -> &Client;
}

pub(crate) trait GenerateW : Api{
    /// ### 计算关键参数
    /// - 不同验证类型的关键参数不同
    fn calculate_key(&mut self, args: Self::ArgsType) -> String;
    /// ### 根据关键参数生成w
    fn generate_w(&self, key: &str, gt: &str, challenge: &str, c: &str, s: &str, rt: &str) -> String;
}

pub(crate) trait Test: Api + GenerateW {
    /// ### 测试
    fn test(&mut self, url: &str) {
        let rt = "82253e788a7b95e9";
        let (gt, challenge) = self.register_test(url);
        let (_, _) = self.get_c_s(gt.as_str(), challenge.as_str(), None);
        let _ = self.get_type(gt.as_str(), challenge.as_str(), None);
        let (c, s, args) = self.get_new_c_s_args(gt.as_str(), challenge.as_str());
        let key = self.calculate_key(args);
        let w = self.generate_w(key.as_str(), gt.as_str(), challenge.as_str(),
                                serde_json::to_string(&c).unwrap().as_str(), s.as_str(), rt);
        sleep(Duration::new(2, 0));
        let res = self.verify(gt.as_str(), challenge.as_str(), Option::from(w.as_str()));
        println!("{:?}", res);
    }
}