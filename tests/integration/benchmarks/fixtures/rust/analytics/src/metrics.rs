use crate::models::{Sample, Summary};

pub fn summarize(samples: &[Sample]) -> Summary {
    let total: f64 = samples.iter().map(|sample| sample.value).sum();
    let count = samples.len().max(1) as f64;
    let average = total / count;

    Summary {
        label: samples
            .first()
            .map(|sample| sample.label.clone())
            .unwrap_or_else(|| "unknown".to_owned()),
        average,
        alert: false,
    }
}

pub fn is_alert(summary: &Summary) -> bool {
    summary.average > 50.0
}
