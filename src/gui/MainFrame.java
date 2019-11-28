package gui;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Toolkit;

import javax.swing.JFrame;


/*
Author: Ziqi Tan
*/
public class MainFrame extends JFrame {
	
	private static MainFrame mainFrame = new MainFrame();
	private BoardPanel boardPanel;
	
	private MainFrame() {
		setTitle("Go");
		// setExtendedState(JFrame.MAXIMIZED_BOTH);  // Full size as the screen
		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		setSize((int)screenSize.getWidth() / 3 * 2, (int)screenSize.getHeight() );
		// setLocationRelativeTo(null);  			  // Frame stay in center
		setResizable(false);
		setLayout(new BorderLayout());
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);  // close and exit
		boardPanel = BoardPanel.getInstance();
		add(boardPanel);
		setBoardPanel();
		setVisible(true);
	}
	
	public static MainFrame getInstance() {
		return mainFrame;
	}
	
	public void setBoardPanel() {
		boardPanel.setEnabled(true);
		boardPanel.setVisible(true);
	}
	
}
