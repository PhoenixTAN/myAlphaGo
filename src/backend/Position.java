package backend;
/*
Author: Ziqi Tan
*/
public class Position {
	
	int x;
	int y;
	int state;
	// 1 for black, 2 for white and 0 for null
	
	/**
	 * Constructor
	 * */
	public Position( int x, int y, int state) {
		this.x = x;
		this.y = y;
		this.state = state;
	}
}
