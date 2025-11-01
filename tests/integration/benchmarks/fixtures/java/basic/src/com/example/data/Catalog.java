package com.example.data;

import java.util.HashMap;
import java.util.Map;

public final class Catalog {
	private static final Map<String, String> CAPTIONS = new HashMap<>();

	private Catalog() {}

	static {
		CAPTIONS.put("baseline", "Baseline Dataset");
		CAPTIONS.put("spiky", "Spiky Dataset");
	}

	public static String describe(String dataset) {
		return CAPTIONS.getOrDefault(dataset, "Unknown Dataset");
	}
}
