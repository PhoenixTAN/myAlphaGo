package gui;

import java.awt.Button;
import java.awt.Choice;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Label;
import java.awt.Panel;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;


/*
Author: Ziqi Tan
*/
public class ControlPanel extends Panel implements ActionListener {
	
	private static ControlPanel controlPanel = new ControlPanel();
	
	private static int width;
	private static int height;
	
	// game logic
	private Choice gameMode;
	
	public static ControlPanel getInstance() {
		return controlPanel;
	}
	
	private ControlPanel() {

		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		width = screenSize.width / 3 * 2 / 6;
		height = screenSize.height;
		setSize(width, height);

		setLayout(null);
		
		int textWidth = (int) (this.getSize().getWidth() / 3 * 2);
		int textHeight = 20;
		
		int x = 30;
		int y = (int) (this.getSize().getHeight() / 10);
		
		Label gameModeLabel = new Label("Game mode", Label.CENTER);
		gameModeLabel.setFont(new Font("TimesRoman", Font.PLAIN, 18));		
		gameModeLabel.setBounds(x, y, textWidth, textHeight);
		add(gameModeLabel);
		
		gameMode = new Choice();
		gameMode.add("Human-Human");
		gameMode.add("Human-Computer");
		gameMode.add("Computer-Computer");
		gameMode.add("Computer-Human");
		gameMode.setBounds(x, (int) (y + textHeight * 1.5), textWidth, textHeight);		
		add(gameMode);
		
		Button newGameButton = new Button("New game"); 
		newGameButton.setBounds(x, (int) (y + textHeight * 5), textWidth, textHeight + 5);
		add(newGameButton);
		newGameButton.addActionListener(this);
	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if( e.getActionCommand().contentEquals("New game") ) {
			BoardPanel.getInstance().newGame();
		}
		
	}
	

	
}
