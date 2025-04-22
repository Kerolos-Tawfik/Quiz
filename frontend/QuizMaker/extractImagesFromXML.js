import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseStringPromise } from 'xml2js';

// resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const xmlPath = path.join(__dirname, 'الأسئلة-102-استيعاب-المقرو-1-14461020-1834.xml');
const outputDir = path.join(__dirname, 'public/images');

fs.readFile(xmlPath, 'utf-8', async (err, data) => {
  if (err) return console.error('❌ خطأ في قراءة ملف XML:', err);

  try {
    const result = await parseStringPromise(data);
    const questions = result.quiz.question || [];

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    questions.forEach((q) => {
      const files = q.questiontext?.[0]?.file;

      if (files && files.length > 0) {
        files.forEach((file) => {
          const fileName = file.$.name;
          const content = file._;

          if (fileName && content) {
            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, Buffer.from(content, 'base64'));
            console.log(`✅ تم استخراج الصورة: ${fileName}`);
          }
        });
      }
    });

    console.log('\n🎉 كل الصور اتفكّت بنجاح في:', outputDir);
  } catch (e) {
    console.error('❌ خطأ في تحليل XML:', e);
  }
});
