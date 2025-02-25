// src/components/FontBase64Converter.jsx
import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function FontBase64Converter() {
    const [fontName, setFontName] = useState('');
    const [fontStyle, setFontStyle] = useState('normal');
    const [base64Content, setBase64Content] = useState('');

    // 파일 선택 시 base64 문자열 추출
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 기본적으로 파일 이름에서 확장자를 제거한 값을 폰트 이름으로 사용합니다.
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            setFontName(nameWithoutExt);

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                // dataUrl 형식: "data:font/ttf;base64,AAA..."
                const base64Str = dataUrl.substring(dataUrl.indexOf('base64,') + 7);
                setBase64Content(base64Str);
            };
            reader.readAsDataURL(file);
        }
    };

    // jsPDF에 사용할 자바스크립트 코드 생성 후 파일 다운로드
    const handleDownload = () => {
        const createdFileName = `${fontName}-${fontStyle}.js`;
        let jsFile = '';
        jsFile += "(function(jsPDFAPI){\n";
        jsFile += `  var font = "${base64Content}";\n`;
        jsFile += "  var callAddFont = function() {\n";
        jsFile += `    this.addFileToVFS("${createdFileName}", font);\n`;
        jsFile += `    this.addFont("${createdFileName}", "${fontName}", "${fontStyle}");\n`;
        jsFile += "  };\n";
        jsFile += "  jsPDFAPI.events.push(['addFonts', callAddFont]);\n";
        jsFile += "})(jsPDF.API);";

        const blob = new Blob([jsFile], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, createdFileName);
    };

    return (
        <div>
            <h2>Font Base64 Converter</h2>
            <div>
                <label>
                    Font Name:
                    <input
                        type="text"
                        value={fontName}
                        onChange={(e) => setFontName(e.target.value)}
                        placeholder="폰트 이름"
                    />
                </label>
            </div>
            <div>
                <label>
                    Font Style:
                    <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                        <option value="normal">normal</option>
                        <option value="bold">bold</option>
                        <option value="italic">italic</option>
                        <option value="bolditalic">bolditalic</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Select Font File:
                    <input type="file" onChange={handleFileChange} />
                </label>
            </div>
            {base64Content && (
                <div>
                    <button className="bg-blue-500 rounded-md p-2 text-white" onClick={handleDownload}>Download jsPDF Font File</button>
                </div>
            )}
        </div>
    );
}

export default FontBase64Converter;
