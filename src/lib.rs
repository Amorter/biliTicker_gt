#![recursion_limit = "256"]
mod abstraction;
mod click;
mod error;
mod py;
mod slide;
// mod w;

#[cfg(test)]
mod tests {
    use std::time::Instant;

    use crate::abstraction::{Api, GenerateW, Test};
    use crate::click::Click;
    use crate::slide::Slide;

    #[test]
    fn slide_test() {
        let mut slide = Slide::default();
        let validate = slide
            .test("http://127.0.0.1:5000/pc-geetest/register")
            .unwrap();
        println!("{}", validate);
    }

    #[test]
    fn click_test() {
        let mut click = Click::default();
        let validate = click
            .test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
            .unwrap();
        println!("{}", validate);
    }

    #[test]
    fn click_test_batch() {
        let mut click = Click::default();

        let sstart = Instant::now();
        for i in 1..=100 {
            println!("{}", i);
            let start = Instant::now();
            let (gt, challenge) = click
                .register_test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
                .unwrap();
            let validate = click.simple_match_retry(gt.as_str(), challenge.as_str()).unwrap();
            println!("{}", validate);
            let end = Instant::now() - start;
            println!("{:?}", end);
        }
        println!("avage: {}s", (Instant::now() - sstart).as_secs_f64()/ 100f64);
    }


    #[test]
    fn test_bug() {
        let mut click = Click::default();
        click.calculate_key("https://static.geetest.com/captcha_v3/batch/v3/75028/2024-07-01T17/word/0bcf1b437373471f9c45d607063e00d0.jpg".to_string()).unwrap();
    }
}
