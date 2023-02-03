
# 脚本

```javascript

    const displayStatus = item => {
        return '';
    }

    const getColumns = () => {
        return [
            {
                field: '#index',
                label: '序号',
                width: 30,
                align: "center"
            },
            {
                field: 'name',
                label: '姓名',
                width: 120,
                weight: 1
            },
            {
                field: 'gender',
                label: '性别',
                align: "center",
                width: 60,
                formatter: value => value == 'M' ? '男' : '女',
                escapeHTML: false
            },
            {
                field: 'age',
                label: '年龄',
                align: "right",
                width: 60
            },
            {
                label: '状态',
                align: "center",
                width: 120,
                formatter: displayStatus
            },
            {
                field: 'note',
                label: '备注',
                width: 140,
                weight: 2
            }
        ]
    }

    const handleChevronClick = (item) => {
        ctx.openInlineFrameDialog(`/qms/xxx/ksksk/${item.id}`)
    }
    console.log(utils);
    const params = {
        from: utils.today().add('days', -7).toJSON(),
        to: utils.today().toJSON()
    }

    return {getColumns, handleChevronClick, params}

```