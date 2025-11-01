package com.example.data;

import com.example.model.Record;

import java.util.ArrayList;
import java.util.List;

public final class Reader {
	private Reader() {}

	public static List<Record> load(String dataset) {
		List<Record> records = new ArrayList<>();
		records.add(new Record(dataset, 42));
		records.add(new Record(dataset, 27));
		return records;
	}
}
