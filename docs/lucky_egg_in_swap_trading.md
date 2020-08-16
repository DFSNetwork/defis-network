### 交易挖矿彩蛋: Lucky Egg 幸运暴击（限时活动）

#### 设计思路

在比特币挖矿系统中，存在幸运值的概念。平均每十分钟出块的基础上，通常有幸运的矿工，能够在十分钟内提前算出哈希值，提前获得矿工奖励。

在DFS的交易挖矿矿池中，我们同样保留这“幸运值”的概念。这一彩蛋，将改变平平无奇的“手续费补贴”挖矿模型。

#### 参数配置

以下，为幸运彩蛋限时活动的参数配置，参数指明了

1. 哪些池子，会出现幸运彩蛋
2. 幸运彩蛋触发条件
3. 幸运彩蛋的奖励加成

```
[{
      "mid": 5,
      "default_distount": "0.20000000000000001",
      "lucky_distount": "3.00000000000000000",
      "trigger_value_max": "1000.0000 EOS"
    },{
      "mid": 39,
      "default_distount": "0.20000000000000001",
      "lucky_distount": "2.75000000000000000",
      "trigger_value_max": "1500.0000 EOS"
    }
  ]

```

参数解读: 

目前在 DFS/EOS 和 KEY/EOS 池子中交易，有几率会触发幸运彩蛋。

DFS/EOS池子，触发条件是交易额小于 1500 EOS。奖励加成是 2.75。是普通交易挖矿的13.75倍。

KEY/EOS池子，触发条件是交易额小于 1000 EOS。奖励加成是 3。是普通交易挖矿的15倍。

#### 规则和算法

平均每十分钟，会出现一个 Lucky Egg。 
满足以下两个条件的交易，可视为触发 Lucky Egg条件，获得Lucky Egg的额外奖励:

1. 交易额小于 trigger_value_max 参数。
2. 交易的时间，在每个十分钟的第一分钟的60秒内。
3. 每个指定的池子中，每十分钟，有且仅有一个Lucky Egg出现。先到先得。

代码示例： 

```
uint64_t lucky_key = current_time_point().sec_since_epoch() / 60;
bool is_lucky_hint = lucky_key % 10 == 0;
double discount = default_distount; //default 0.2
if (is_lucky_hint && tranding_eos.amount <= trigger_value_max.amount))
{
   discount = lucky_distount;
}
```

在交易挖矿算法中，有一个 discount 系数，表示交易手续费的打折力度。

触发Lucky Egg的奖励，将获得 discount=lucky_distount 的奖赏。这意味着这笔交易手续费不仅全免， 还有额外DFS赠送。

但交易挖矿最终所能获得的DFS奖励，依旧受到 damping 参数、pool_weight 、dfs_price参数的影响，

挖矿所得DFS，同样20%进入DSP saving pool 公共账户，等待DSR分配。 

#### 案例详解：

挖矿示例: 

* 交易额 1000 EOS -> EOS/DFS , 手续费 3 EOS
* pool_weight:  1.2
* damping : 0.75
* lucky_distount: 3 (默认0.2)
* dfs price: 0.5


假设这笔交易，触发了每十分钟一次的幸运暴击 :

```
trading_mining_reward = 3 / 0.5 * 3 * 0.75 * 1.2 * 0.8 = 12.96 DFS 
```

假设这笔交易，没有触发幸运暴击 :

```
trading_mining_reward = 3 / 0.5 * 0.2 * 0.75 * 1.2 * 0.8 = 0.8640 DFS 
```

15 倍交易挖矿收益！十分钟一次。

不仅科学家可以进行技术竞赛。

矿机生产商一样有肉吃。

做市商则更是无风险躺赚做市收益。

DFS吃货的大佬的DFS买入需求，也得到了满足。



## 总结

打造“幸运彩蛋”限时活动目的，是作为项目启动初期的技术运营方案。

也便于和其他有实力的项目方 如 “KEY”项目方进行合作。一起把KEY池子做大。

当项目步入正轨后。我们将进一步调整和优化运营方案。


