package gui;
/*
Author: Ziqi Tan
*/

import java.awt.Graphics;
import java.awt.Image;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;

import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Color;

public class BoardPanel extends JPanel implements MouseListener {
	
	/**
	 * Singleton Pattern
	 * */
	private static BoardPanel boardPanel = new BoardPanel();
	public static BoardPanel getInstance() {
		return boardPanel;
	}
	
	private ControlPanel controlPanel;
	
	private Image boardImage;
	private Graphics boardGraphics;
	
	private int imageSize;
		
	// final variables
	private static final int numOfLines = 19;
	private static final int interval = 40;
	private static final int pieceRadius = 30;
	
	// Origin Point of the grid
	private static int gridX;
	private static int gridY;
	
	// Game logic
	private int grid[][];
	private int turn = 1;
	
	/**
	 * Constructor
	 * */
	private BoardPanel() {
		grid = new int[numOfLines + 1][numOfLines + 1];
		imageSize = interval * (numOfLines + 4);	
		setLayout(new BorderLayout());
		
		controlPanel = ControlPanel.getInstance();
		add(controlPanel, "West");
		addMouseListener(this);
	}
	
	/**
	 * Method: addNotify
	 * Function:
	 * 		Creates the Panel's peer. 
	 * 		The peer allows you to modify the appearance of the panel 
	 * 		without changing its functionality.
	 * */
	public void addNotify() {
		super.addNotify();
		// java.awt.Component.createImage(int width, int height)
		boardImage = createImage(imageSize, imageSize);
		boardGraphics = boardImage.getGraphics();
	}

	public void updateInfo() {
		
	}
	
	/**
	 * Method: paint
	 * Function: Draw the board
	 * */
	@Override
	public void paint(Graphics graphics) {
				
		int width = MainFrame.getInstance().getWidth();
		int height = MainFrame.getInstance().getHeight();
	
		// Background color
		int beginX = width / 10;
		int beginY = height / 10;
		boardGraphics.setColor(new Color(180, 150, 100));
		boardGraphics.fillRect(beginX, beginY, imageSize, imageSize);
		
		// Line color
		boardGraphics.setColor(Color.black);
		
		// parallel lines
		beginX = width / 10 + interval; 
		beginY = height / 10 + interval;
		int lineLength = interval * ( numOfLines - 1 );
		boardGraphics.drawLine(beginX, beginY + 1, beginX + lineLength, beginY + 1);
		for( int i = 0; i < numOfLines; i++ ) {
			boardGraphics.drawLine(beginX, beginY, beginX + lineLength, beginY);			
			beginY += interval;
		}
		boardGraphics.drawLine(beginX, beginY - 1 - interval, beginX + lineLength, beginY - 1 - interval);
		
		// vertical lines
		beginX = width / 10 + interval; 
		beginY = height / 10 + interval;
		boardGraphics.drawLine(beginX + 1, beginY, beginX + 1, beginY  + lineLength);
		for( int i = 0; i < numOfLines; i++ ) {
			boardGraphics.drawLine(beginX, beginY, beginX, beginY  + lineLength);
			beginX += interval;
		}
		boardGraphics.drawLine(beginX + 1 - interval, beginY, beginX + 1 - interval, beginY  + lineLength);
		
		// Nine points
		int radius = interval / 4;
		int x = width / 10 + interval * 4 - 5;
		int y = height / 10 + interval * 4 - 5;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);

		x = width / 10  + interval * 4 - 5;
		y = height / 10 + interval * 10 - 5;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x = width / 10  + interval * 4 - 5;
		y = height / 10 + interval * 16 - 5;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);
		
		x += interval * 6;
		boardGraphics.fillOval(x, y, radius, radius);
		
		beginX = width / 10 + interval;
		beginY = height / 10 + interval;
		// Draw Go pieces
		for( int i = 0; i < grid.length; i++ ) {
			for( int j = 0; j < grid[0].length; j++ ) {
				if( grid[i][j] == 1 ) {
					boardGraphics.setColor(Color.BLACK);
					boardGraphics.fillOval(beginX + (i-1)*interval - pieceRadius / 2, beginY + (j-1)*interval  - pieceRadius / 2, pieceRadius, pieceRadius);					
				}
				else if( grid[i][j] == 2 ) {
					boardGraphics.setColor(Color.WHITE);
					boardGraphics.fillOval(beginX + (i-1)*interval - pieceRadius / 2, beginY + (j-1)*interval  - pieceRadius / 2, pieceRadius, pieceRadius);
				}
			}
		}
		
	    /**img - the specified image to be drawn. This method does nothing if img is null.
	     * x - the x coordinate.
	     * y - the y coordinate.
	     * observer - object to be notified as more of the image is converted.
	     */ 
		int leftDistance = 80;
		int upDistance = 0;
		gridX = width / 10 + interval + leftDistance;
		gridY = height / 10 + interval + upDistance;
		graphics.drawImage(boardImage, leftDistance, upDistance, this);	
		
	}

	@Override
	public void mouseClicked(MouseEvent clickEvent) {
		
		if( clickEvent.getButton() == MouseEvent.BUTTON1 && clickEvent.getClickCount() == 1 ) {
			int eventX = clickEvent.getX();
			int eventY = clickEvent.getY();

			int relativeX = eventX - gridX;
			int relativeY = eventY - gridY;
			
			int x = relativeX / interval + 1;
			int y = relativeY / interval + 1;
			// round
			if( relativeX % interval > interval / 2 ) {
				x++;
			}
			// round
			if( relativeY % interval > interval / 2 ) {
				y++;
			}
			System.out.println("xy: (" + x  + ", " + y  + ")");
			boolean isAvaliable = isAvailablePosition(x, y);
			if( isAvaliable ) {
				grid[x][y] = turn;
				turn = (turn == 1) ? 2 : 1;
				repaint();
			}
			
		}

	}

	@Override
	public void mouseEntered(MouseEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseExited(MouseEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mousePressed(MouseEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseReleased(MouseEvent arg0) {
		// TODO Auto-generated method stub
		
	}
	
	/**
	 * Method: isAvailablePosition
	 * Function:
	 * 		Check whether this position is available to go.
	 * */
	private boolean isAvailablePosition( int x, int y ) {
		if( grid[x][y] != 0 ) {
			return false;
		}
		return true;
	}
	
	/**
	 * Method: newGame
	 * */
	public void newGame() {
		for( int i = 0; i < grid.length; i++ ) {
			for( int j = 0; j < grid[0].length; j++ ) {
				grid[i][j] = 0;
			}
		}
		repaint();
		System.out.println("newGame");
	}
	
}
