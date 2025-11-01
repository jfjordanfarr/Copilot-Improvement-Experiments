package com.example.app;

import com.example.data.Reader;
import com.example.format.ReportWriter;
import com.example.model.Record;

import java.util.List;

public final class App {
	private App() {}

	public static String run(String dataset) {
		List<Record> records = Reader.load(dataset);
		return ReportWriter.write(records);
	}
}
