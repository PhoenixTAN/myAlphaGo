# Monte Carlo Tree Search

In computer science, **Monte Carlo tree search (MCTS)** is a heuristic search algorithm for some kinds of decision processes, most notably those employed in software that plays board games. In that context MCTS is used to solve the game tree.

蒙特卡洛树搜索，是启发式搜索算法，用于决策，最著名的是适用于棋盘类游戏。

MCTS was combined with neural networks in 2016 for computer Go. 

2016年MCTS跟神经网络结合，被用于AlphaGo.

## Principle of operation

The focus of MCTS is on the analysis of the most promising moves, expanding the search tree based on random sampling of the search space.

MCTS的焦点就是分析最具有前途的走棋，通过对搜索空间的随机采样去扩展这棵搜索树。

The application of Monte Carlo tree search in games is based on many `playouts`, also called `roll-outs`.

In each playout, the game is played out to the very end by selecting moves at random. 

The final game result of each playout is then used to weigh the nodes in the game tree so that better nodes are more likely to be chosen in future playouts.

The most basic way to use playouts is to apply the same number of playouts after each legal move of the current player, then choose the move which led to the most victories.

The efficiency of this method—called Pure Monte Carlo Game Search—often increases with time as more playouts are assigned to the moves that have frequently resulted in the current player's victory according to previous playouts.

Each round of Monte Carlo tree search consists of four steps:
- Selection: Start from root R and select successive child nodes until a leaf node L is reached. The root is the current game state and a leaf is any node that has a potential child from which no simulation (playout) has yet been initiated. The section below says more about a way of biasing choice of child nodes that lets the game tree expand towards the most promising moves, which is the essence of Monte Carlo tree search.
- Expansion: Unless L ends the game decisively (e.g. win/loss/draw) for either player, create one (or more) child nodes and choose node C from one of them. Child nodes are any valid moves from the game position defined by L.
- Simulation: Complete one random playout from node C. This step is sometimes also called playout or rollout. A playout may be as simple as choosing uniform random moves until the game is decided (for example in chess, the game is won, lost, or drawn).
- Backpropagation: Use the result of the playout to update information in the nodes on the path from C to R.