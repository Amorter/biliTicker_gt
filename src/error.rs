use std::error::Error as StdError;
use std::fmt::{Debug, Display, Formatter};

pub type Result<T> = std::result::Result<T, Error>;

pub struct Error {
    inner: Box<Inner>,
}

pub(crate) type BoxError = Box<dyn StdError + Send + Sync>;

/// ### 错误内容
/// - kind: 错误类型
/// - source 错误源
struct Inner {
    kind: Kind,
    /// 系统异常装箱
    source: Option<BoxError>,
}
#[derive(Debug)]
pub(crate) enum Kind {
    NetWorkError,
    MissingParam(String),
    ParseError,
    Other(String),
}

impl Debug for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let mut builder = f.debug_struct("bili_ticket极验模块错误");

        builder.field("错误类型", &self.inner.kind);

        if let Some(ref source) = self.inner.source {
            builder.field("源", source);
        }

        builder.finish()
    }
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&self, f)
    }
}

impl StdError for Error {
    fn source(&self) -> Option<&(dyn StdError + 'static)> {
        self.inner.source.as_ref().map(|e| &**e as _)
    }
}

impl Error {
    pub(crate) fn new<E>(kind: Kind, source: Option<E>) -> Self
    where
        E: Into<BoxError>,
    {
        Error {
            inner: Box::new(Inner {
                kind,
                source: source.map(Into::into),
            }),
        }
    }

    pub(crate) fn new_without_source(kind: Kind) -> Self {
        Error {
            inner: Box::new(Inner { kind, source: None }),
        }
    }
}

pub(crate) fn net_work_error<E: Into<BoxError>>(e: E) -> Error {
    Error::new(Kind::NetWorkError, Some(e))
}

pub(crate) fn missing_param(s: &str) -> Error {
    Error::new_without_source(Kind::MissingParam(s.to_string()))
}

pub(crate) fn parse_error<E: Into<BoxError>>(e: E) -> Error {
    Error::new(Kind::ParseError, Some(e))
}

pub(crate) fn other<E: Into<BoxError>>(s: &str, e: E) -> Error {
    Error::new(Kind::Other(s.to_string()), Some(e))
}

pub(crate) fn other_without_source(s: &str) -> Error {
    Error::new_without_source(Kind::Other(s.to_string()))
}
