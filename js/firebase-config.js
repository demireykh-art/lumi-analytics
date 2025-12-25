/* ===========================================
   Firebase Configuration
   =========================================== */

const firebaseConfig = {
    apiKey: "AIzaSyBbTw25l74gr-okjslfwlYVySfBqWI11pI",
    authDomain: "lumi-crm-27996.firebaseapp.com",
    projectId: "lumi-crm-27996",
    storageBucket: "lumi-crm-27996.firebasestorage.app",
    messagingSenderId: "218523273794",
    appId: "1:218523273794:web:d02b26b7f2df51759afbdb"
};

// Firebase 초기화
let app, db;

function initFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('✅ Firebase 연결 성공');
        
        // 연결 상태 업데이트
        const statusBadge = document.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.classList.add('online');
            statusBadge.innerHTML = '<span class="status-dot"></span> 연결됨';
        }
        
        return true;
    } catch (error) {
        console.error('❌ Firebase 연결 실패:', error);
        return false;
    }
}

// Firestore 헬퍼 함수들
const FirebaseDB = {
    // 예약 저장
    async saveReservation(reservation) {
        try {
            const docRef = await db.collection('reservations').add({
                ...reservation,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('예약 저장됨:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('예약 저장 실패:', error);
            return null;
        }
    },
    
    // 예약 조회 (날짜별)
    async getReservationsByDate(date) {
        try {
            const snapshot = await db.collection('reservations')
                .where('date', '==', date)
                .orderBy('startTime')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('예약 조회 실패:', error);
            return [];
        }
    },
    
    // 시술 저장
    async saveTreatment(treatment) {
        try {
            const docRef = await db.collection('treatments').doc(String(treatment.id)).set(treatment);
            return true;
        } catch (error) {
            console.error('시술 저장 실패:', error);
            return false;
        }
    },
    
    // 시술 목록 조회
    async getTreatments() {
        try {
            const snapshot = await db.collection('treatments').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('시술 조회 실패:', error);
            return [];
        }
    },
    
    // 인력 저장
    async saveStaff(staff) {
        try {
            await db.collection('staff').doc(String(staff.id)).set(staff);
            return true;
        } catch (error) {
            console.error('인력 저장 실패:', error);
            return false;
        }
    },
    
    // 인력 목록 조회
    async getStaff() {
        try {
            const snapshot = await db.collection('staff').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('인력 조회 실패:', error);
            return [];
        }
    },
    
    // 실시간 예약 리스너
    onReservationsChange(date, callback) {
        return db.collection('reservations')
            .where('date', '==', date)
            .onSnapshot(snapshot => {
                const reservations = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(reservations);
            });
    }
};
