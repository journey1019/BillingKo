import jsPDF from 'jspdf';
import nanumGothicFont from '@/assets/fonts/NanumGothic-normal';
import companyLogoBase64 from '@/assets/images/companyLogoBase64';


export const generateInvoicePDF = (invoiceBasicData) => {
    const doc = new jsPDF();

    // 한글 지원 폰트 추가
    doc.addFileToVFS("NanumGothic.ttf", nanumGothicFont);
    doc.addFont("NanumGothic.ttf", "NanumGothic", "normal");
    doc.setFont("NanumGothic");

    // PDF 맨 위 왼쪽에 회사 로고 삽입 (위치 및 크기는 필요에 따라 조정)
    doc.addImage(companyLogoBase64, 'PNG', 20, 10, 40, 10);

    // invoiceBasicData에서 필요한 값들을 추출
    const companyName = invoiceBasicData.find(item => item.code_name === 'ko_company_name')?.code_value || '';
    const postCode = invoiceBasicData.find(item => item.code_name === 'ko_post_code')?.code_value || '';
    const address = invoiceBasicData.find(item => item.code_name === 'ko_address')?.code_value || '';
    const telNumber = invoiceBasicData.find(item => item.code_name === 'ko_tel_number')?.code_value || '';
    const faxNumber = invoiceBasicData.find(item => item.code_name === 'ko_fax_number')?.code_value || '';
    const homepage = invoiceBasicData.find(item => item.code_name === 'ko_homepage')?.code_value || '';

    // 텍스트 출력 내용 구성 (작은 글씨로)
    const textLines = [
        companyName,
        `(${postCode}) ${address}`,
        `고객센터: ${telNumber}`,
        `Fax: ${faxNumber}`,
        `홈페이지: ${homepage}`,
    ];

    // 작은 글씨 설정 (예: 폰트 사이즈 10)
    doc.setFontSize(10);
    // 회사 로고 아래에서부터 텍스트 출력 (여기서는 y좌표 35부터 시작)
    let startY = 35;
    textLines.forEach((line, index) => {
        doc.text(line, 10, startY + (index * 7));
    });

    return doc;
};
