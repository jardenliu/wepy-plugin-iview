# wepy-plugin-iview
> 一个iView的wepy插件

## 特性
* 自动注入
* 简易配置

## 用法
1. 安装`iview-app`
```bash
  npm i https://github.com/TalkingData/iview-weapp.git -S
```
2. 安装`wepy-plugin-iview`
```bash
  npm i wepy-plugin-iview
```
3. 在`wepy.config.js`中`plugins`项中添加 `iview:{}`
```javascript
  plugins: {
    // ...
    iview: {
    }
    // ...
  }
```
4. 运行项目，即可使用如`<i-button></i-button>`的iView的全部组件啦

5. `$toast`、`$Message`的引入
```javascript
    import {$Toast, $Message} from 'wepy-iview'
```

## 全局注入配置

默认是在`pages`目录下的所有页面的`usingComponents`中，自动注入全部iview的组件。
```javascript
  iview: {
      pagePath: 'pages',
      // 可选，默认为 pages。如果页面目录不为pages，或有多个目录, 通过此值设置。
      // 参考配置：
      // pagePath: 'page2'                         page2为页面有目录
      // pagePath:['page1','page2',...]            多页面目录
         
      config: {
        inject: true,
        // 可选，默认为 true,注入iView的全部组件。 如果不想全部, 通过此值设置。
        // 参考配置：
        // inject: false                           不注入任何组件 
        // inject:['button','icon',...]            只注入部分组件
                
        prefix: 'i-',
        // 可选，默认为 'i-',组件名前缀。 如果使用其他组件名前缀, 通过此值设置。
        // 参考配置：
        // prefix: 'a-'                            button的组件名为'a-button'
      }
    }
```

## 页面注入配置

很多情况下，不希望注入太多的组件。可以通过全局配置的`inject:false`或`inject:['button','icon',...]`来实现。
但是某些特殊的页面又需要一些特殊的组件。可以通过下面的方式设置。

1. 在页面的config中添加 `iView: ['button', 'card']`,即可快速注入。该配置在当前页面，权重高于全局的inject设置
```javascript
  config = {
    iView: ['button', 'card']
  }

```
