import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

export default function handler(req, res) {
  try {
    // Excelファイルのパス
    const filePath = path.join(process.cwd(), 'public', 'rule.xlsx');

    // Excelを読み込む
    const workbook = xlsx.readFile(filePath);
    const storeNames = [];
    const storeAddresses = [];

    // 全シートを処理し B1（店舗名）と B4（住所） の値を取得
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const nameCell = sheet['B1']; // 店舗名
      const addressCell = sheet['B4']; // 住所

      if (nameCell && nameCell.v) {
        storeNames.push(nameCell.v);
      } else {
        storeNames.push(""); // 空欄の場合
      }

      if (addressCell && addressCell.v) {
        storeAddresses.push(addressCell.v);
      } else {
        storeAddresses.push(""); // 空欄の場合
      }
    });

    // デバッグ用ログ（PowerShellに出力される）
    console.log("取得した店舗名:", storeNames);
    console.log("取得した住所:", storeAddresses);

    // JSON形式でクライアントに返す
    res.status(200).json({ storeNames, storeAddresses });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ error: 'Failed to load store data' });
  }
}



