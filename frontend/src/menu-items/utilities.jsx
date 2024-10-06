// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Account',
      type: 'item',
      url: '/account',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Current Record',
      type: 'item',
      url: '/records',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'History',
      type: 'item',
      url: '/history',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default utilities;
