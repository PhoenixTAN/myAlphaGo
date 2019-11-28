package gui;
/*
Author: Ziqi Tan
*/
public class Request {
	
	private String timestamp;
	private String head;
	private Object data;
	
	public Request(String _timestamp, String _head, Object _data) {
		this.timestamp = _timestamp;
		this.head = _head;
		this.data = _data;
	}
	
	@Override
	public String toString() {
		return "Request: " + timestamp + "\n" + "head: " + head + "\n" + "data: " + data;
	}
	
}
