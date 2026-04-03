/// <reference types="react-scripts" />

// Fix react-icons compatibility with React 19
// react-icons returns ReactNode which can include `undefined` in React 19,
// but JSX components must return Element | null.
declare module 'react-icons/fi' {
  import { IconType } from 'react-icons';
  export const FiActivity: IconType;
  export const FiAlertCircle: IconType;
  export const FiAlertTriangle: IconType;
  export const FiArchive: IconType;
  export const FiArrowLeft: IconType;
  export const FiArrowRight: IconType;
  export const FiCheck: IconType;
  export const FiCheckCircle: IconType;
  export const FiChevronDown: IconType;
  export const FiChevronLeft: IconType;
  export const FiChevronRight: IconType;
  export const FiChevronUp: IconType;
  export const FiCopy: IconType;
  export const FiDelete: IconType;
  export const FiDownload: IconType;
  export const FiEdit: IconType;
  export const FiEdit2: IconType;
  export const FiExternalLink: IconType;
  export const FiEye: IconType;
  export const FiEyeOff: IconType;
  export const FiFile: IconType;
  export const FiFilter: IconType;
  export const FiFolder: IconType;
  export const FiGrid: IconType;
  export const FiHeart: IconType;
  export const FiHome: IconType;
  export const FiImage: IconType;
  export const FiInfo: IconType;
  export const FiLink: IconType;
  export const FiList: IconType;
  export const FiLoader: IconType;
  export const FiLock: IconType;
  export const FiLogIn: IconType;
  export const FiLogOut: IconType;
  export const FiMail: IconType;
  export const FiMap: IconType;
  export const FiMapPin: IconType;
  export const FiMenu: IconType;
  export const FiMinus: IconType;
  export const FiMoreHorizontal: IconType;
  export const FiMoreVertical: IconType;
  export const FiPackage: IconType;
  export const FiPercent: IconType;
  export const FiPhone: IconType;
  export const FiPlus: IconType;
  export const FiPlusCircle: IconType;
  export const FiRefreshCw: IconType;
  export const FiSave: IconType;
  export const FiSearch: IconType;
  export const FiSettings: IconType;
  export const FiShoppingBag: IconType;
  export const FiShoppingCart: IconType;
  export const FiSliders: IconType;
  export const FiStar: IconType;
  export const FiTag: IconType;
  export const FiTrash: IconType;
  export const FiTrash2: IconType;
  export const FiTruck: IconType;
  export const FiUpload: IconType;
  export const FiUser: IconType;
  export const FiUserPlus: IconType;
  export const FiUsers: IconType;
  export const FiX: IconType;
  export const FiXCircle: IconType;
}

declare module 'react-icons' {
  import { SVGAttributes } from 'react';
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = (props: IconBaseProps) => React.JSX.Element;
}
