# Mastering the game of Go with deep neural networks and tree search

The game of Go has long been viewed as the most challenging of classic games for artificial intelligence owing to its 
enormous search space and the difficulty of evaluating board positions and moves. 

由于围棋庞大的搜索空间和评估棋盘落子的难度，围棋长期以来被看作是对于人工智能最有挑战性的游戏。

Here we introduce a new approach to computer Go that uses ‘value networks’ to evaluate board positions and ‘policy networks’ to select moves. 

我们引入一种AI围棋，它用`value networks`去评估棋盘位置，用`policy networks`去选择落子。

These deep neural networks are trained by a novel combination of supervised learning from human expert games, and reinforcement learning from games of self-play. 

这个深度神经网络会被一个新颖的组合所训练————利用人类围棋高手的棋局来进行监督学习，用自己跟自己下棋，进行加强学习。

Without any lookahead search, the neural networks play Go at the level of state-of-the-art Monte Carlo tree search programs that simulate thousands of random games of self-play. 

不使用任何的提前搜索，这个神经网络下围棋的时候，会使用最新的蒙特卡洛树搜索程序，这个程序模拟了数千局自己跟自己下的棋局。

We also introduce a new search algorithm that combines Monte Carlo simulation with value and policy networks. 

我们也引入了一种新的搜索算法，这个算法结合了蒙特卡洛仿真，以及前面提到的`value networks`和`policy networks`。

Using this search algorithm, our program AlphaGo achieved a 99.8% winning rate against other Go programs, and defeated the human European Go champion by 5 games to 0. 

用这样的搜索算法，我们的AlphaGo在与其他围棋程序的对战达到了99.8%的胜率，并且以5：0的比分击败了人类欧洲围棋冠军。

This is the first time that a computer program has defeated a human professional player in the full-sized game of Go, a feat previously thought to be at least a decade away.

这是有史以来，计算机程序首次在完整的围棋棋盘中击败人类职业围棋选手，这种壮举先前被认为至少得在10年后才能完成。

