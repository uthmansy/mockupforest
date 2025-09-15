"use client";
import Container from "@/components/Container";
import { useState } from "react";

export default function PromptGenerator() {
  const [setId, setSetId] = useState("");
  const [archiveFolder, setArchiveFolder] = useState("mockupforest_xx_xx_xxxx");
  const [baseCategory, setBaseCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [prompt, setPrompt] = useState("");

  const generatePrompt = () => {
    const template = `
I have a CSV with mockup filenames (e.g., item-1, iphone-14-black) and their sizes in mb.  
Generate a PostgreSQL script that inserts one row into \`public.mockups\` for each filename.  

Use the following configuration:
- set_id = '${setId}'
- download_url prefix = 'https://archive.org/download/${archiveFolder}/[filename].zip'
- preview_url prefix = 'https://mzjwyiqfusnwbzhtelvh.supabase.co/storage/v1/object/public/files/thumbnails/[filename].jpg'
- base category = '${baseCategory}'
- SEO keywords = [${keywords}]

### Requirements per row:
1. Title: unique, descriptive, professional.
2. Slug: URL-friendly version of the title.
3. Description: 1–3 sentences, unique and keyword-rich.
4. Body: HTML formatted, ≥150 words, containing:
   - Features section: editable layers, smart object layers, shadows, 4000x3000 px, grouped layers.
   - How to section: numbered steps (open "place your design here", edit smart objects, change colors via color layers, export).
   - Include only relevant SEO keywords.
5. categories: ARRAY['${baseCategory}','packaging','more']
6. tags: relevant tags extracted from filename + base category.
7. file_size: corresponding file size.
8. author: MockupForest.
9. license: "Free for personal and commercial use".
10. is_featured: true for ~10%.
11. is_published: true.
12. views/downloads: 0.
13. Output: valid SQL script with ready-to-run INSERTs.
`;
    setPrompt(template.trim());
  };

  return (
    <Container>
      <div className="flex min-h-screen">
        {/* Left side - inputs */}
        <div className="w-1/2 p-6 pl-0 border-r">
          <h1 className="text-xl font-bold mb-4">Prompt Generator</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Set ID</label>
              <input
                type="text"
                value={setId}
                onChange={(e) => setSetId(e.target.value)}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Archive Folder
              </label>
              <input
                type="text"
                value={archiveFolder}
                onChange={(e) => setArchiveFolder(e.target.value)}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Base Category
              </label>
              <input
                type="text"
                value={baseCategory}
                onChange={(e) => setBaseCategory(e.target.value)}
                className="w-full border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                SEO Keywords
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full border p-2"
                rows={4}
              />
            </div>

            <button
              onClick={generatePrompt}
              className="bg-black text-white px-4 py-2"
            >
              Generate Prompt
            </button>
          </div>
        </div>

        {/* Right side - result */}
        <div className="w-1/2 p-6 pr-0">
          <h2 className="text-lg font-semibold mb-2">Generated Prompt</h2>
          <textarea
            className="w-full h-[70vh] border p-3 text-sm font-mono"
            readOnly
            value={prompt}
          />
        </div>
      </div>
    </Container>
  );
}
