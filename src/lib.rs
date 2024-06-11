use crate::implement::Slide;
use pyo3::prelude::*;

mod abstraction;
mod error;
mod implement;
mod py;

#[cfg(test)]
mod tests {
    use crate::abstraction::Test;
    use crate::implement::{Click, Slide};
    use std::panic::AssertUnwindSafe;

    #[test]
    fn slide_test() {
        let mut slide = Slide::default();
        slide.test("http://127.0.0.1:5000/pc-geetest/register");
    }

    #[test]
    fn click_test() {
        let mut click = Click::default();
        click.test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web");
    }

    #[test]
    fn click_test_batch() {
        let mut click = Click::default();
        let mut suc = 0;
        for _ in 1..=100 {
            let r = std::panic::catch_unwind(AssertUnwindSafe(|| {
                click
                    .test("https://passport.bilibili.com/x/passport-login/captcha?source=main_web");
            }));

            if r.is_ok() {
                suc += 1;
            }
        }
        println!("suc: {}", suc as f32 / 100f32);
    }
}