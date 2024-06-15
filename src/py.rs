use crate::abstraction::{Api, GenerateW, Test, VerifyType};
use crate::click::Click;
use crate::error::Error;
use crate::slide::Slide;
use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::PyModule;
use pyo3::{pyclass, pymethods, pymodule, Bound, PyErr, PyResult};

#[pymodule]
fn bili_ticket_gt_python(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<SlidePy>()?;
    m.add_class::<ClickPy>()?;
    Ok(())
}

impl From<Error> for PyErr {
    fn from(err: Error) -> Self {
        PyErr::new::<PyRuntimeError, _>(err.to_string())
    }
}

#[pyclass]
struct SlidePy {
    inner: Slide,
}

#[pymethods]
impl SlidePy {
    #[new]
    fn new() -> Self {
        SlidePy {
            inner: Slide::default(),
        }
    }

    fn register_test(&mut self, url: &str) -> PyResult<(String, String)> {
        self.inner.register_test(url).map_err(PyErr::from)
    }

    fn get_c_s(
        &mut self,
        gt: &str,
        challenge: &str,
        w: Option<&str>,
    ) -> PyResult<(Vec<u8>, String)> {
        self.inner.get_c_s(gt, challenge, w).map_err(PyErr::from)
    }

    fn get_type(&self, gt: &str, challenge: &str, w: Option<&str>) -> PyResult<String> {
        match self.inner.get_type(gt, challenge, w) {
            Ok(verify_type) => match verify_type {
                VerifyType::Slide => Ok("slide".to_string()),
                VerifyType::Click => Ok("click".to_string()),
            },
            Err(e) => Err(PyErr::from(e)),
        }
    }
    fn get_new_c_s_args(
        &self,
        gt: &str,
        challenge: &str,
    ) -> PyResult<(Vec<u8>, String, <Slide as Api>::ArgsType)> {
        self.inner
            .get_new_c_s_args(gt, challenge)
            .map_err(PyErr::from)
    }

    fn verify(&self, gt: &str, challenge: &str, w: Option<&str>) -> PyResult<(String, String)> {
        self.inner.verify(gt, challenge, w).map_err(PyErr::from)
    }

    fn calculate_key(&mut self, args: <Slide as Api>::ArgsType) -> PyResult<String> {
        self.inner.calculate_key(args).map_err(PyErr::from)
    }

    fn generate_w(
        &self,
        key: &str,
        gt: &str,
        challenge: &str,
        c: &str,
        s: &str,
        rt: &str,
    ) -> PyResult<String> {
        self.inner
            .generate_w(key, gt, challenge, c, s, rt)
            .map_err(PyErr::from)
    }

    fn test(&mut self, url: &str) -> PyResult<String> {
        self.inner.test(url).map_err(PyErr::from)
    }
}

#[pyclass]
struct ClickPy {
    inner: Click<'static>,
}

#[pymethods]
impl ClickPy {
    #[new]
    fn new() -> Self {
        ClickPy {
            inner: Click::default(),
        }
    }

    fn register_test(&mut self, url: &str) -> PyResult<(String, String)> {
        self.inner.register_test(url).map_err(PyErr::from)
    }

    fn get_c_s(
        &mut self,
        gt: &str,
        challenge: &str,
        w: Option<&str>,
    ) -> PyResult<(Vec<u8>, String)> {
        self.inner.get_c_s(gt, challenge, w).map_err(PyErr::from)
    }

    fn get_type(&self, gt: &str, challenge: &str, w: Option<&str>) -> PyResult<String> {
        match self.inner.get_type(gt, challenge, w) {
            Ok(verify_type) => match verify_type {
                VerifyType::Slide => Ok("slide".to_string()),
                VerifyType::Click => Ok("click".to_string()),
            },
            Err(e) => Err(PyErr::from(e)),
        }
    }
    fn get_new_c_s_args(
        &self,
        gt: &str,
        challenge: &str,
    ) -> PyResult<(Vec<u8>, String, <Click as Api>::ArgsType)> {
        self.inner
            .get_new_c_s_args(gt, challenge)
            .map_err(PyErr::from)
    }

    fn verify(&self, gt: &str, challenge: &str, w: Option<&str>) -> PyResult<(String, String)> {
        self.inner.verify(gt, challenge, w).map_err(PyErr::from)
    }

    fn calculate_key(&mut self, args: <Click as Api>::ArgsType) -> PyResult<String> {
        self.inner.calculate_key(args).map_err(PyErr::from)
    }

    fn generate_w(
        &self,
        key: &str,
        gt: &str,
        challenge: &str,
        c: &str,
        s: &str,
        rt: &str,
    ) -> PyResult<String> {
        self.inner
            .generate_w(key, gt, challenge, c, s, rt)
            .map_err(PyErr::from)
    }

    fn test(&mut self, url: &str) -> PyResult<String> {
        self.inner.test(url).map_err(PyErr::from)
    }

    fn simple_match(&mut self, gt: &str, challenge: &str) -> PyResult<String> {
        self.inner.simple_match(gt, challenge).map_err(PyErr::from)
    }

    fn simple_match_retry(&mut self, gt: &str, challenge: &str) -> PyResult<String> {
        self.inner
            .simple_match_retry(gt, challenge)
            .map_err(PyErr::from)
    }
}
