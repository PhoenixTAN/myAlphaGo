package backend;
/*
Author: Ziqi Tan
*/
/**
 * Rules for board.
 * */
public interface Rules {
	
	// Go
	public boolean go(int x, int y, int player);
	// check legal go
	
	// take
	public boolean take();
	
	// rob
	
	
}
