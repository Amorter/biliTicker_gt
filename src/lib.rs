mod abstraction;
mod click;
mod error;
mod py;
mod slide;

#[cfg(test)]
mod tests {
    use crate::abstraction::{Api, Test};
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
        click
            .test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
            .unwrap();
    }

    #[test]
    fn click_test_batch() {
        let mut click = Click::default();
        let (gt, challenge) = click
            .register_test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web")
            .unwrap();
        let validate = click.simple_match(gt.as_str(), challenge.as_str()).unwrap();
        println!("{}", validate);
    }
}
