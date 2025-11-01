package com.example.format;

import com.example.data.Catalog;
import com.example.model.Record;

import java.util.List;

public final class ReportWriter {
	private ReportWriter() {}

	public static String write(List<Record> records) {
		String label = records.isEmpty() ? "empty" : records.get(0).dataset();
		int total = records.stream().mapToInt(Record::value).sum();
		return Catalog.describe(label) + ":" + total;
	}
}
