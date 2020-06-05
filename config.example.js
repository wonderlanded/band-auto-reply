module.exports = { 
    phone: '', // 핸드폰 번호
    password: '', // 밴드 비밀번호
    bandID: '', // 대상 밴드 ID
    replyTxt: '', // 댓글 텍스트
    webDriverServer: 'http://localhost:9515',
    usePush: true, // 모바일 푸시 로그인 여부 (false시 전화번호 인증번호)
    onSuccess: '성공', // 성공 메세지
    webhook: { // 디스코드 웹훅
        id: '',
        secret: ''
    }
}