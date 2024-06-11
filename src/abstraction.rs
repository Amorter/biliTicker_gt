use crate::error::{
    missing_param, net_work_error, other, other_without_source, parse_error, Result,
};
use reqwest::blocking::Client;
use serde_json::Value;
use std::collections::HashMap;
use std::thread::sleep;
use std::time::Duration;
pub(crate) enum VerifyType {
    Slide,
    Click,
}

pub(crate) trait Api {
    type ArgsType;
    /// ### 申请验证码
    /// #### 返回值
    /// - gt
    /// - challenge
    fn register_test(&self, url: &str) -> Result<(String, String)> {
        let res = self.client().get(url).send().map_err(net_work_error)?;
        let res = res.json::<Value>().expect("解析失败");
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
    /// ### 获取c和s参数
    /// #### 返回值
    /// - c
    /// - s
    fn get_c_s(&self, gt: &str, challenge: &str, w: Option<&str>) -> Result<(Vec<u8>, String)> {
        let url = "https://api.geetest.com/get.php";
        let mut params = HashMap::from([
            ("gt", gt),
            ("challenge", challenge),
            ("callback", "geetest_1717911889779"),
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
            .strip_prefix("geetest_1717911889779(")
            .ok_or_else(|| other_without_source("前缀错误"))?
            .strip_suffix(")")
            .ok_or_else(|| other_without_source("后缀错误"))?;
        let res: Value = serde_json::from_str(res).map_err(parse_error)?;
        let data = res.get("data").ok_or_else(|| missing_param("data"))?;
        let c: Vec<u8> =
            serde_json::from_value(data.get("c").ok_or_else(|| missing_param("c"))?.clone())
                .map_err(parse_error)?;
        Ok((
            c,
            data.get("s")
                .ok_or_else(|| missing_param("s"))?
                .as_str()
                .ok_or_else(|| missing_param("s"))?
                .to_string(),
        ))
    }
    /// ### 获取验证码类型
    /// #### 返回值
    /// - 验证码类型
    fn get_type(&self, gt: &str, challenge: &str, w: Option<&str>) -> Result<VerifyType> {
        let url = "http://api.geevisit.com/ajax.php";
        let mut params = HashMap::from([
            ("gt", gt),
            ("challenge", challenge),
            ("callback", "geetest_1717934072177"),
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
            .strip_prefix("geetest_1717934072177(")
            .ok_or_else(|| other_without_source("前缀错误"))?
            .strip_suffix(")")
            .ok_or_else(|| other_without_source("后缀错误"))?;
        let res: Value = serde_json::from_str(res).map_err(parse_error)?;
        let data = res.get("data").ok_or_else(|| missing_param("data"))?;
        let result = data
            .get("result")
            .ok_or_else(|| missing_param("result"))?
            .as_str()
            .ok_or_else(|| missing_param("result"))?;
        match result {
            "slide" => Ok(VerifyType::Slide),
            "click" => Ok(VerifyType::Click),
            _ => Err(other_without_source("未知验证码类型")),
        }
    }
    /// ### 获取新的c,s,challenge参数和验证所需要的参数
    /// #### 返回值
    /// - c
    /// - s
    /// - challenge
    /// - args(不定数目)
    fn get_new_c_s_args(
        &self,
        gt: &str,
        challenge: &str,
    ) -> Result<(Vec<u8>, String, Self::ArgsType)>;
    /// ### 验证
    /// #### 返回值
    /// - message
    /// - validate
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
        println!("{:?}", res);
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
    /// ### 下载图片
    /// #### 返回值
    /// - img
    fn download_img(&self, img_url: &str) -> Result<Vec<u8>> {
        let res = self.client().get(img_url).send().map_err(net_work_error)?;
        Ok(res.bytes().unwrap().to_vec())
    }

    fn client(&self) -> &Client;
}

pub(crate) trait GenerateW: Api {
    /// ### 计算关键参数
    /// - 不同验证类型的关键参数不同
    fn calculate_key(&mut self, args: Self::ArgsType) -> Result<String>;
    /// ### 根据关键参数生成w
    fn generate_w(
        &self,
        key: &str,
        gt: &str,
        challenge: &str,
        c: &str,
        s: &str,
        rt: &str,
    ) -> Result<String>;
}

pub(crate) trait Test: Api + GenerateW {
    /// ### 测试
    fn test(&mut self, url: &str) {
        let rt = "82253e788a7b95e9";
        let (gt, challenge) = self.register_test(url).unwrap();
        let (_, _) = self.get_c_s(gt.as_str(), challenge.as_str(), None).unwrap();
        let _ = self.get_type(gt.as_str(), challenge.as_str(), None);
        let (c, s, args) = self
            .get_new_c_s_args(gt.as_str(), challenge.as_str())
            .unwrap();
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
        sleep(Duration::new(2, 0));
        let res = self
            .verify(gt.as_str(), challenge.as_str(), Option::from(w.as_str()))
            .unwrap();
        println!("{:?}", res);
    }
}