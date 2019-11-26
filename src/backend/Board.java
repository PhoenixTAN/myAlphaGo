package backend;

import java.util.ArrayList;
import java.util.List;

/*
Author: Ziqi Tan
*/
public class Board {
	
	private List<Position> board;
	
	/**
	 * Constructor
	 * */
	public Board() {
		board = new ArrayList<Position>();
		initializeBoard();
	}
	
	/**
	 * Helper function to initialize the board.
	 * */
	private void initializeBoard() {
		for( int x = 0; x < Config.board_length; x++ ) {
			for( int y = 0; y < Config.board_width; y++ ) {
				board.add(new Position(x, y, 0));
			}
		}
	}
	
	/**
	 * Helper function to make (x,y) to 1D.
	 * */
	private int xyToIndex() {
		
		return 0;
	}
	
	/**
	 * Helper function to make 1D to (x,y).
	 * */
	private int[] indexToxy() {
		
		
		return null;
	}
	
	/**
	 * Print the board
	 * */
	public void printBoardOnConsole() {
		
	}
	
}	
