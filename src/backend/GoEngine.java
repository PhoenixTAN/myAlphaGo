package backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.InputMismatchException;

/*
Author: Ziqi Tan
*/
public class GoEngine extends Game implements Rules {
	
	private List<Position> board;
	private static int gameMode = 0;
	private Scanner scanner;
	
	public GoEngine() {
		scanner = new Scanner(System.in);
	}
	
	@Override
	protected void initialize() {
		initializeBoard();
		setGameMode();
		printBoardOnConsole();
	}

	@Override
	protected void startPlay() {
		
		int turn = 1;
		int end = 1;

		
	}

	@Override
	protected void endPlay() {
		
		scanner.close();
	}
	
	/**
	 * Helper function to initialize the board.
	 * */
	private void initializeBoard() {
		board = new ArrayList<Position>();
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
	 * 
	 * */
	private int getPositionState( int x, int y ) {
		for( int i = 0; i < board.size(); i++ ) {
			if( board.get(i).x == x && board.get(i).y == y ) {
				return board.get(i).state;
			}
		}
		return 0;
	}
	
	/**
	 * Print the board
	 * */
	public void printBoardOnConsole() {
		for( int i = 0; i < Config.board_length; i++ ) {
			for( int j = 0; j < Config.board_width; j++ ) {
				int state = getPositionState(i , j);
				System.out.print(state + " ");
			}
			System.out.println();
		}
	}
	
	/**
	 * Method: setGameMode
	 * */
	private void setGameMode() {
		try {
			gameMode = scanner.nextInt();
		}
		catch(InputMismatchException error) {
			error.printStackTrace();
		}		
	}

	@Override
	public boolean go(Position position, int player) {
		
		return false;
	}

	
}
