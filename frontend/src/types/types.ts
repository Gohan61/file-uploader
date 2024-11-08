export interface folderType {
  id: number;
  title: string;
  userId: number;
}

export interface folderData {
  folders: folderType[];
}

export type Folders = () => void;

export interface fileType {
  id: number;
  title: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string | undefined;
  size: string;
  uploadTime: number;
  link: string;
  folderId: number;
}

export interface fileData {
  data: fileType[];
}

export type GetFolder = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined,
  folder: string
) => void;
