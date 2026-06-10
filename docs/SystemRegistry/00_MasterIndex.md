# ECOS Master Index (系统总索引)

## 研发最高准则 / Architecture Lock v1.0
任何新页面、非独立通用组件、数据表、接口开发前，**必须**在此注册中心进行备案。
未登记即视为不存在，禁止进行无备案代码合并与测试运转。

## 平台业务与核心决策中枢树状拓扑
```text
ECOS Platform (AI Commerce OS)
├── Super Admin (平台超级大盘 & AI 决策控制台)
│   └── AI Brain Center (多智能体决策大脑内核)
├── Shop Controls (商家管理大盘)
│   ├── Sales Center (销售大盘)
│   ├── Product Center (商品库管理)
│   ├── Order Center (多币种跨国订单处理)
│   ├── Customer Center (CRM 客户关系中枢)
│   ├── Marketing Center (营销与增长分流)
│   ├── Finance Center (财务统计与算效损益)
│   └── Logistics Center (跨境智运物流)
├── Platform Infra (核心基础设施)
│   ├── POS (Sales Channels > Point Of Sale [PLANNED])
│   ├── CMS (Content Management System [PLANNED])
│   ├── Settings Center (租户、店铺及角色授权设置)
│   └── Apps Marketplace (应用与扩展插件市场)
```

## 全站模块状态字典说明
- `[DEV]` : 开发进行中，尚未转入发布
- `[TEST]` : 已在沙箱或边缘进行合规测试中
- `[LIVE]` : 已经进入生产环境，冻结任意修改
- `[DEPRECATED]` : 冗余废弃历史组件，已作硬防错隔离
