# Mastering the game of Go with deep neural networks and tree search

TODO：部分翻译不是很准确。

## Introduction

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

All games of perfect information have an optimal value function, $v^*(s)$, which determines the outcome of the game, from every board position or state $s$, under perfect play by all players. 

所有有着完美信息的游戏，都有一个最优的value function $v^*(s)$,这个函数决定了这个游戏的结果，从所有的棋盘位置或者状态state $s$, 在所有玩家都做出最优下法的情况下。

These games may be solved by recursively computing the optimal value function in a search tree containing approximately $b^d$ possible sequences of moves, where $b$ is the game's breadth (number of legal move per position) and $d$ is its depth (game length).

这些游戏可以用递归来计算搜索树里面的最优函数，这个搜索树包括了大约$b^d$个可能的连续的落子，$b$是游戏的宽度，即每个位置合法的落子，$d$是游戏的深度，即游戏的长度。

想象一棵深度为$d$的$b$叉树，一共会有$b^d$个叶子节点。

In large games, such as chess (b $\approx$ 35, d  $\approx$ 80) and especially Go (b $\approx$ 250, d $\approx$ 150), exhaustive search is infeasible, but the effective search space can be reduced by two general principles.

在大一点的游戏，例如象棋 (b $\approx$ 35, d  $\approx$ 80)，特别是围棋(b $\approx$ 250, d $\approx$ 150)，穷举搜索是不可行的，但是有效的搜索空间可以用两个通用的原则去压缩。

First, the depth of the search may be reduced by `position evaluation`: truncating the search tree at state $s$ and replacing the subtree below $s$ by an approximate value function $v(s) \approx v^*(s)$ that predicts the outcome from state $s$.

首先，搜索树的深度可以通过`position evaluation`来减少：对搜索树在state $s$进行剪枝，并用近似价值函数$v(s) \approx v^*(s)$取代这颗子树，这个函数预测了state $s$的游戏结果。

This approach has led to superhuman performance in chess, checkers and othello, but it was believed to be intractable in Go due to the complexity of the game. 

这种方法在chess, checkers和othello中有过人的表现，但是在复杂的围棋中是很棘手的。

Second, the breadth of the search may be reduced by sampling actions from a policy $p(a|s)$ that is a probability distribution over possible moves $a$ in position $s$. 

其次，搜索树的宽度可以这样的方式减少：从policy概率分布中采样行动，这个概率分布是在position $s$ 条件下可能的行动$a$.

For example, Monte Carlo rollouts search to maximum depth without branching at all, by sampling long sequences of actions for both players from a policy $p$. 

例如，蒙特卡洛rollout去搜索最大深度，但并不进行分支，通过对双方玩家在同一策略policy $p$下采样一长串的行动。

Averaging over such rollouts can provide an effective position evaluation, achieving superhuman performance in backgammon and Scrabble, and weak amateur level play in Go.

对这些rollouts取平均，就能提供一个有效的位置估计，在西洋双陆棋和拼字游戏中有过人表现，在与较弱的围棋业余选手的对战中有较好的表现。

Monte Carlo tree search (MCTS)[11,12] uses Monte Carlo rollouts to estimate the value of each state in a search tree. 

蒙特卡洛树搜索[11,12]，使用蒙特卡洛rollouts来估计一棵搜索树中每个状态的价值。

As more simulations are executed, the search tree grows larger and the relevant values become more accurate. 

随着更多的仿真被执行，这个搜索树越来越大，相关的值也会变得更加准确。

The policy used to select actions during search is also improved over time, by selecting children with higher values.

这个选择下一步行动的策略也会随着时间推移而提高，通过选择有更高价值的孩子。

Asymptotically, this policy converges to optimal play, and the evaluations converge to the optimal value function. 

近似地，这个策略会收敛于最优的策略，估分也会收敛于最优的价值函数。

The strongest current Go programs are based on MCTS, enhanced by policies that are trained to predict human expert moves. 目前最强的围棋程序就是基于MCTS的，被用于预测人类围棋高手下法的策略增强。

These policies are used to narrow the search to a beam of high-probability actions, and to sample actions during rollouts. 

这样的策略用于搜索树的剪枝，只需要去计算高概率的行动，然后采样。

This approach has achieved strong amateur play. 
这种方法已经达到业余高手的水平。

However, prior work has been limited to shallow policies or value functions based on a linear combination of input features. 

然而，前人的工作被限制在比较浅显的策略或者线性的价值函数。

Recently, deep convolutional neural networks have achieved unprecedented performance in visual domains: for example, image classification, face recognition, and playing Atari games. 

最近深度神经网络已经在视觉领域达到了一个史无前例的表现：例如，图像分类，面部识别和Atari游戏。

They use may layers of neurons, each arranged in overlapping tiles, to construct increasingly abstract, localized representations of an image. 

它们用很多层神经元，每一层都用交叠的块来排布，从而构建出抽象的图像代表。

We employ a similar architecture for the game of Go.

我们采用了类似的架构。

We pass in the board position as a 19 x 19 image and use convolutional layers to construct a representation of the position.

我们将棋盘位置作为 19 x 19 图像传递，并使用卷积层来构建位置的表示。

We use these neural networks to reduce the effective depth and breadth of the search tree: evaluating positions using a value network, and sampling actions using a policy network.

我们使用这些神经网络来减少搜索树的有效深度和广度：使用价值网络评估位置，并使用策略网络对动作进行采样。

We train the neural networks using a pipeline consisting of several stages of machine learning (Fig. 1).

我们用一连串阶段的机器学习来训练我们的神经网络（图1）。

We begin by training a supervised 
learning (SL) `policy network` $p_\sigma$ directly from expert human moves. 

我们一开始，直接用人类围棋高手的策略来训练一个监督学习（SL）的策略网络`policy network`$p_\sigma$。

This provides fast, efficient learning updates with immediate feedback and high-quality gradients.

这提供了快速，有效的学习更新，并且会有及时的反馈和高质量的梯度。

Similar to prior work[13,15], we also train a 
`fast policy` $p_\pi$ that can rapidly sample actions during rollouts.

类似于前人的工作[13,15]，我们也训练了一个快速策略`fast policy` $p_\pi$，在rollouts时可以迅速采样出行动。

Next, we train a reinforcement learning (RL) policy network $p_\rho$ that improves the SL policy network by optimizing the final outcome of games of self-play.

接下来，我们对刚刚得到的`policy network`进行加强学习，通过优化最终的自我对战结果，得到`policy network` $p_\rho$.

This adjusts the policy towards the correct goal of winning games, rather than maximizing predictive accuracy. 

这就把策略朝着胜利的方向调整，而不是最大化预测的准确性。

Finally, we train a value network $v_\theta$ that predicts the winner of games played by the RL policy network against itself.

最后，我们训练一个价值网络$v_\theta$,用于预测该游戏的胜利者，这个胜利者是加强学习网络中对战的胜者。

Our program AlphaGo efficiently combines the 
policy and value networks with MCTS.

我们的AlphaGo程序高效地结合了策略网络、价值网络与MCTS.

## Supervised learning of policy networks
For the first stage of the training pipeline, we build on prior work on predicting expert moves in the game of Go using supervised learning. [13,21-24]

训练链条的第一阶段，我们基于前人的工作使用监督学习去预测人类专家的走棋。

The SL policy network 
