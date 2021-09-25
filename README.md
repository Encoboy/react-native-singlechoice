
## 描述
<!-- 单选的评分组件 -->
```
	import SingleChoice from 'react-native-siglechoice'

   数据结构：
   arrayList: [
        {
          item: '质量',
          children: [
            {item: '优秀', score: 10},
            {item: '良好', score: 8},
            {item: '合格', score: 6},
          ],
        },
        {
          item: '安全',
          children: [
            {item: '安全', score: 8},
            {item: '不安全', score: 6},
          ],
        },
      ],
  使用方式：
	<SingleChoice arrayList={this.state.arrayList} number={3} sureSumit={(newList,score)=>{}}/>
```


  