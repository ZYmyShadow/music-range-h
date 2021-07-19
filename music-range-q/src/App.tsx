import { useState, useEffect } from 'react';
import { Input, List, Tag, Space, Divider, Card, Drawer } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './App.css';
import axios from 'axios';

const { Search } = Input;

class MusicList {
  // let musicListName: string;
  musicListName: string;
  upName: string;
  // let musicList: [string];
  musicList: string[];

  constructor(upName: string, musicListName: string, musicList: string[]) {
    this.upName = upName;
    this.musicListName = musicListName;
    this.musicList = musicList;
  }
}

const App = () => {
  const [allMusicName, setAllMusicName] = useState<string[]>([]);
  const [musicList, setMusicList] = useState<MusicList[]>([]);
  const [searchNameList, setSearchNameList] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [drawervalue, setDrawervalue] = useState<MusicList>();

  useEffect(() => {
    getMusicFile((musicfileList) => getAllMusicName(musicfileList));
    // setAllMusicName(getAllMusicName(musicList));
  }, []);

  const getMusicFile = (callback) => {
    let musicfileList: MusicList[] = [];
    // const url = "https://raw.githubusercontent.com/ZYmyShadow/music-range-h/main/json.json";
    // const url = "http://localhost:10010/data";
    // axios.get(url).then((res) => {
    // axios.post(url).then((res) => {
    axios.post("/api/data").then((res) => {
      const data = res.data.data;
      data.forEach(value => {
        let temp = new MusicList(value.upName, value.musicListName, value.musicList);
        musicfileList.push(temp);
      });
      setMusicList(musicfileList);
      callback(musicfileList);
    });
  };

  const getAllMusicName = (musicList: MusicList[]) => {
    let allmusicNameList: string[] = [];
    musicList.map((value) => {
      const str: string = value.upName + "-" + value.musicListName + "-";
      value.musicList.map((value1) => {
        allmusicNameList.push(str + value1);
      });
    })
    setAllMusicName(allmusicNameList);
    console.log(allmusicNameList);
  }

  const onSearch = value => {
    console.log(value);
    setSearchText(value);
    if (value) {
      let temp = [];
      allMusicName.forEach(item => {
        if (item.includes(value)) temp.push(item);
      });
      setSearchNameList(temp);
    } else {
      setSearchNameList([]);
    }
  };

  const onCardClick = (value: MusicList) => {
    setDrawervalue(value);
    showDrawer();
  };

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      { /*搜索框，高度最大400，上滑缩小，下拉变大*/ }
      <Search
        prefix={ <SearchOutlined /> }
        allowClear
        placeholder="请输入歌名或者主播名"
        onSearch={ onSearch }
      />
      { /*循环卡片List，自动读取所有歌单文件，并储存成List，使用随机数出现小于等于6个的歌曲名字*/ }
      {
        searchText == "" ?
          musicList.map((value, index) => {
            const musicList1 = value.musicList;

            return <Card
              onClick={ () => { onCardClick(value); } }
              title={ value.musicListName }
              key={ index }
              extra={ <Tag color="red">{ value.upName }</Tag> }
            >
              {
                musicList1.length < 3 ?
                  musicList1.map((value, index) => {
                    return <p key={ index }>{ value }</p>
                  }) :
                  <>
                    <p>{ musicList1[0] }</p>
                    <p>{ musicList1[1] }</p>
                    <p>{ musicList1[2] }</p>
                  </>
              }
            </Card>
          }) :
          <List
            dataSource={ searchNameList }
            header={ <Divider orientation="left">搜索结果</Divider> }
            locale={ { emptyText: "暂无数据" } }
            renderItem={ item => {
              const strs = item.split('-');
              return (
                <List.Item>
                  <Space size={ 0 }>
                    <Tag color="red">{ strs[0] }</Tag>
                    <Tag color="volcano">{ strs[1] }</Tag>
                  </Space>
                  { strs[2] }
                </List.Item>
              )
            } }
          />
      }
      { /*点击卡片后，卡片放大，背部遮罩，卡片内部一行一首歌，可以上下滑动，可卡片内部搜索*/ }
      { drawervalue ? <Drawer
        title={ drawervalue.upName + "-" + drawervalue.musicListName }
        placement="right"
        closable={ false }
        onClose={ onClose }
        visible={ visible }
      >
        <List
          dataSource={ drawervalue.musicList }
          renderItem={ item => {
            return (
              <List.Item>
                { item }
              </List.Item>
            )
          } }
        />
      </Drawer> : <></> }
    </>
  );
}

export default App;
