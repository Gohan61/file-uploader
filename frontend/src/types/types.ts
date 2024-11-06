export interface folderType {
  id: number;
  title: string;
  userId: number;
}

export interface folderData {
  folders: folderType[];
}

export type Folders = () => void;
