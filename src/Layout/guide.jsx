import React, { useState } from 'react';
import {
  HomeIcon,
  BookOpenIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon,
  ShieldCheckIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Guide = () => {
  const [activeSection, setActiveSection] = useState('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userType, setUserType] = useState('user'); // 'user' or 'admin'

  const userSections = [
    {
      id: 'landing',
      title: 'หน้าหลักก่อนเข้าสู่ระบบ',
      number: 1,
      icon: HomeIcon,
      color: 'from-purple-50 to-purple-50',//#31363F
      content: {
        purpose: 'เป็นหน้าแรกที่ผู้ใช้ทุกคนเห็น ทำหน้าที่แนะนำภาพรวมของเว็บและนำทางไปหน้าลงชื่อเข้าใช้หรือสมัครสมาชิก',
        features: [
          'โลโก้และคำอธิบายสั้น ๆ ของเว็บไซต์',
          'ปุ่ม Login และลิงก์ไป Register',
          'ภาพประกอบช่วยให้รู้สึกเป็นมิตร',
        ],
        images: [
          '../../assets/1.png',
        ],
        steps: [
          'หากมีบัญชีอยู่แล้ว → กด “Login” เพื่อเข้าสู่ระบบ',
          'หากยังไม่มีบัญชี → กด “Register” เพื่อสร้างบัญชีใหม่',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Login+Button',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Register+Button',
        // ],
        tips: 'ฝั่งข้อความแนะนำควรเน้นประโยชน์ของการใช้งาน เช่น "ช่วยเลือกวิชาที่ตรงกับความคาดหวัง"',
      },
    },
    {
      id: 'login',
      title: 'หน้าเข้าสู่ระบบ',
      number: 2,
      icon: UserCircleIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ยืนยันตัวตนผู้ใช้งานเพื่อเข้าถึงฟีเจอร์ของระบบ',
        features: [
          'ช่องกรอกรหัสนักศึกษาและรหัสผ่าน',
          'ปุ่ม Login',
          'ปุ่มลิงก์ไป Register',
          'ไอคอน Home เพื่อกลับหน้าแรก',
        ],
        images: [
          '../../assets/2.png',
        ],
        steps: [
          'กรอกรหัสนักศึกษา (Student ID) → กรอกรหัสผ่าน (Password) → กด Login เพื่อเข้าสู่ระบบ',
          'หากยังไม่มีบัญชี → คลิก “Register” เพื่อสมัคร',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Student+ID+Field',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Password+Field',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Login+Button',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Register+Link',
        // ],
        tips:
          'หากยังไม่มีบัญชี → กด Register เพื่อสร้างบัญชีใหม่',

      },
    },
    {
      id: 'register',
      title: 'หน้าลงทะเบียน',
      number: 3,
      icon: UserCircleIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้ใหม่สร้างบัญชีเพื่อเข้าสู่ระบบ',
        features: [
          'ให้ผู้ใช้ใหม่สร้างบัญชีเพื่อเข้าสู่ระบบ',
        ],
        images: [
          '../../assets/3.png'
        ],
        steps: [
          'กรอกรหัสนักศึกษา (Student ID) → กรอกชื่อ (Username) → กรอกรหัสผ่าน (Password) → กด Create Account เพื่อสร้างบัญชี',
          'หากมีบัญชีแล้ว → คลิก “Login” เพื่อเข้าสู่ระบบ',

        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Student+ID+Input',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Name+Input',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Password+Input',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Create+Account+Button',
        // ],
        tips: 'ใช้รหัสผ่านที่มีทั้งตัวพิมพ์ใหญ่-เล็ก ตัวเลขและอักขระพิเศษ',
      },
    },
    {
      id: 'dashboard',
      title: 'หน้าหลักหลังเข้าสู่ระบบ',
      number: 4,
      icon: AcademicCapIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'เป็นศูนย์รวมฟังก์ชันที่ผู้ใช้ต้องการบ่อย ๆ — ค้นหา ดูแจ้งเตือน และเข้าถึงรีวิวยอดนิยม',
        features: [
          'โลโก้, เมนู Home/Course',
          'กระดิ่งแจ้งเตือน',
          'ข้อความ Hello, [ชื่อ]',
          'ช่องค้นหา',
          'รายการ Top 5 รายวิชา',
        ],
        images: [
          '../../assets/4.png',
          '../../assets/4.1.png',
        ],
        steps: [
          'Home: กลับหน้าหลัก - Course: ดูรายวิชาทั้งหมด - Guide: คู่มือการใช้งาน - Student Plan: วางแผนการเรียน',
          'ตรวจสอบข้อความแจ้งเตือนผ่านสัญลักษณ์กระดิ่ง 🔔 Notification',
          'ใช้ช่อง ค้นหารายวิชา เพื่อค้นหาวิชาที่ต้องการ',
          'เลื่อนดู Top 5 รายวิชายอดนิยม → คลิกเพื่อเข้าหน้าโพสต์รีวิวและโพสต์คำถาม',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Home+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Course+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Guide+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Student+Plan+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Notification+Bell',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Search+Box',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Top+5+Courses',
        // ],
        tips: 'ใช้ช่องค้นหาแทนการเลื่อนหาในรายการยาว — ประหยัดเวลา',
      },
    },
    {
      id: 'edit-profile',
      title: 'หน้าแก้ไขโปรไฟล์',
      number: 5,
      icon: Cog6ToothIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้ปรับข้อมูลส่วนตัวและกำหนดการแสดงผลในหน้าโปรไฟล์',
        features: [
          'ฟิลด์แก้ไขชื่อ เกรดเฉลี่ย คณะ สาขา รหัสผ่าน Bio',
          'ตัวเลือกเปิด/ปิดการแสดงข้อมูลบางรายการ',
          'รหัสนักศึกษาไม่สามารถแก้ไได้',
        ],
        images: [
          '../../assets/5.png',
          '../../assets/5.1.png',
        ],
        steps: [
          'คลิกรูปโปรไฟล์ → แสดงแถบเมนู (Dropdown)',
          'คลิก "Profile"',
          'แก้ไขข้อมูลส่วนตัว เช่น ชื่อบัญชีผู้ใช้ (Username) - คณะที่ศึกษา (Faculty) - สาขาที่ศึกษา (Major) เป็นต้น',
          'ปรับการแสดงผลข้อมูล → ให้คนอื่นเห็นหรือไม่',
          'กด “ยืนยัน” เพื่อบันทึกการเปลี่ยนแปลง',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Hello+Name+Button',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Profile+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Edit+Profile+Form',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Privacy+Settings',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Save+Button',
        // ],
        tips: 'เขียน Bio สั้น ๆ และชัดเจน เช่น "สนใจด้าน X, ชอบเรียน Y"',
      },
    },
    {
      id: 'user-profile',
      title: 'หน้าโปรไฟล์ผู้ใช้',
      number: 6,
      icon: UserCircleIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'แสดงข้อมูลและบริบทของคนที่โพสต์รีวิว/คำถาม เพื่อเพิ่มความน่าเชื่อถือ',
        features: [
          'ชื่อ, เกรดเฉลี่ย (ถ้าผู้ใช้เลือกโชว์)',
          'คณะ/สาขา',
          'Bio',
          'ปุ่มปิด/กลับ',
        ],
        images: [
          '../../assets/6.png',
          '../../assets/6.1.png',
        ],
        steps: [
          'จากหน้ารายวิชา / หน้ารีวิว / หน้าโพสต์คำถาม → คลิกชื่อบัญชีผู้ใช้ (Username) ที่คุณสนใจ',
          'ระบบจะเปิดหน้าโปรไฟล์ผู้ใช้ให้คุณดูข้อมูล เช่น ชื่อบัญชีผู้ใช้ (Username) - คณะที่ศึกษา (Faculty) - เกรดเฉลี่ย (Grade) เป็นต้น',
          'กดปุ่ม “ปิด” เพื่อกลับไปยังหน้าก่อนหน้า',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Click+Username',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=User+Profile+View',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Back+Button',
        // ],
        tips: 'โปรไฟล์ที่แสดงข้อมูลพื้นฐานช่วยให้ผู้อ่านประเมินความเกี่ยวข้องของรีวิวได้ดีขึ้น',
      },
    },
    {
      id: 'course-list',
      title: 'หน้ารายวิชา',
      number: 7,
      icon: BookOpenIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'แสดงรายวิชาทั้งหมด และเป็นทางเข้าไปยังหน้ารายวิชาเฉพาะ/รีวิว',
        features: ['รายการวิชา', 'รหัส', 'ชื่ออาจารย์', 'ปุ่มเข้าดูรีวิว'],
        images: [
          '../../assets/7.png',
          '../../assets/7.1.png',
        ],
        steps: [
          'จาก เมนูด้านบน → คลิก Courses',
          'ระบบจะแสดงหน้ารวมรายวิชา (Course List)',
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Courses+Menu',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Course+List+Page',
        // ],
        tips: 'ใช้ฟิลเตอร์ (ถ้ามี) เช่น คณะ/ภาคเรียน เพื่อจำกัดผลลัพธ์ให้แคบลง',
      },
    },
    {
      id: 'post-review',
      title: 'หน้าโพสต์รีวิว',
      number: 8,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้เรียนบันทึกประสบการณ์จริงเกี่ยวกับวิชาอย่างเป็นระบบ',
        features: [
          'ข้อมูลวิชา',
          'ฟอร์มกรอกรีวิว (เซค, ภาคเรียน, ปี, เกรด)',
          'คะแนนดาว 1–5 ในหลายมิติ',
          'สัดส่วนคะแนน',
          'ข้อความรีวิว',
        ],
        images: [
          '../../assets/8.png',
          '../../assets/8.1.png',
          '../../assets/8.2.png'
        ],
        steps: [
          'เข้าหน้านี้ได้จาก : คลิก Top 5 รายวิชายอดนิยมบนหน้าหลัก (Home) - ค้นหาบนหน้าหลัก - จากหน้ารวมรายวิชา (Course List) → คลิกรายวิชาที่ต้องการ',
          'อ่านข้อมูลวิชาที่ส่วนด้านบน',
          'กรอกรีวิว เช่น	เซค (Section) - เทอม (Semester) - ปี (Year) - เกรด (Grade) และให้คะแนนต่าง ๆ เช่น ความน่าสนใจ - การสอน - การบ้าน',
          'กด โพสต์รีวิว (Post Review)',
          'หากต้องการตอบกลับรีวิวคนอื่น → ใช้กล่องความคิดเห็นด้านล่าง'
        ],
        // stepImages: [
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Select+Course',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Course+Information',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Review+Form',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Rating+Stars',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Post+Review+Button',
        //   'https://via.placeholder.com/800x400/9333EA/FFFFFF?text=Comment+Section',
        // ],
        tips: 'เขียนให้เป็นประโยคสั้น ๆ แยกหัวข้อ (ข้อดี / ข้อควรระวัง / คำแนะนำ)',
      },
    },
    {
      id: 'edit-review',
      title: 'หน้าแก้ไขโพสต์รีวิว',
      number: 9,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้สามารถแก้ไขรีวิวที่ตนเองสร้างขึ้นได้',
        features: [
          'ฟอร์มแก้ไขรีวิวทั้งหมด',
          'ปุ่มบันทึกการแก้ไข',
          'ปุ่มยกเลิก',
        ],
        images: [
          '../../assets/9.png',
          '../../assets/9.1.png',
        ],
        steps: [
          'เข้าหน้านี้ได้จาก หน้ารีวิว (Post Review): คลิกสัญลักษณ์ดินสอ ✏️ ที่มุมบนของกล่องรีวิวที่คุณต้องการแก้ไข',
          'แก้ไขข้อความหรือคะแนนตามต้องการ',
          'กด “บันทึกการแก้ไข” เพื่อบันทึกการแก้ไข - กด “ยกเลิกการแก้ไข” หากไม่ต้องการแก้ไข - กด “ลบโพสต์” เพื่อลบรีวิวออกจากระบบ',
        ],
        tips: 'สามารถแก้ไขได้เฉพาะรีวิวที่ตนเองโพสต์เท่านั้น',
      },
    },
    {
      id: 'post-question',
      title: 'หน้าโพสต์คำถาม',
      number: 10,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้สามารถถามคำถามเกี่ยวกับวิชาได้',
        features: [
          'ช่องกรอกหัวข้อคำถาม',
          'ช่องกรอกรายละเอียด',
          'ปุ่มโพสต์คำถาม',
        ],
        images: [
          '../../assets/10.png',
          '../../assets/10.1.png'
        ],
        steps: [
          'กดปุ่ม “โพสต์คำถาม” ด้านข้าง โพสต์รีวิวเพื่อถามคำถาม',
          'พิมพ์คำถามลงในช่องสำหรับคำถาม',
          'กดปุ่ม “ถามคำถาม” เพื่อโพสต์คำถาม',
        ],
        tips: 'ตั้งคำถามที่ชัดเจนและเฉพาะเจาะจง จะได้รับคำตอบที่มีคุณภาพ',
      },
    },
    {
      id: 'edit-question',
      title: 'หน้าแก้ไขโพสต์คำถาม',
      number: 11,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้สามารถถามคำถามเกี่ยวกับวิชาได้',
        features: [
          'ช่องกรอกหัวข้อคำถาม',
          'ช่องกรอกรายละเอียด',
          'ปุ่มโพสต์คำถาม',
        ],
        images: [
          '../../assets/11.png',
          '../../assets/11.1.png',
        ],
        steps: [
          'เข้าหน้านี้ได้จากหน้าโพสต์คำถาม (Question Post) / หน้ารวมรีวิวและคำถาม (Reviews and Questions Overview Page) กดสัญลักษณ์ดินสอ ✏️ ที่มุมบนของคำถามที่คุณต้องการแก้ไข',
          'แก้ไขเนื้อหาโพสต์คำถามที่ต้องการ',
          'กด “บันทึกการแก้ไข” เพื่อบันทึกการแก้ไข - กด “ยกเลิกการแก้ไข” หากไม่ต้องการแก้ไข - กด “ลบคำถาม” หากต้องการลบคำถาม',
        ],
        tips: 'ตั้งคำถามที่ชัดเจนและเฉพาะเจาะจง จะได้รับคำตอบที่มีคุณภาพ',
      },
    },
    {
      id: 'review & question',
      title: 'หน้ารีวิวและคำถามรวม',
      number: 12,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้สามารถถามคำถามเกี่ยวกับวิชาได้',
        features: [
          'ช่องกรอกหัวข้อคำถาม',
          'ช่องกรอกรายละเอียด',
          'ปุ่มโพสต์คำถาม',
        ],
        images: [
          '../../assets/12.png',
          '../../assets/12.1.png'
        ],
        steps: [
          'ใช้ ปุ่มลูกศร เพื่อปิดฝั่งกรอกข้อมูล',
          'ใช้ ปุ่มลูกศร เพื่อเปิดฝั่งกรอกข้อมูล',
        ],
        tips: 'ตั้งคำถามที่ชัดเจนและเฉพาะเจาะจง จะได้รับคำตอบที่มีคุณภาพ',
      },
    },
    {
      id: 'student-plan',
      title: 'หน้าแผนการเรียน',
      number: 13,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ให้ผู้ใช้สามารถถามคำถามเกี่ยวกับวิชาได้',
        features: [
          'ช่องกรอกหัวข้อคำถาม',
          'ช่องกรอกรายละเอียด',
          'ปุ่มโพสต์คำถาม',
        ],
        images: [
          '../../assets/13.png',
          '../../assets/13.1.png',
        ],
        steps: [
          'เข้าหน้านี้ได้จาก แถบเมนูด้านบนชื่อ “StudyPlan”',
          'เลือกหลักสูตรหรือฉบับแผนการเรียนจากด้านซ้าย',
          'ดูรายละเอียดรายวิชาตามปี / เทอมที่แสดงด้านขวา',
        ],
        tips: 'ตั้งคำถามที่ชัดเจนและเฉพาะเจาะจง จะได้รับคำตอบที่มีคุณภาพ',
      },
    },
    {
      id: 'guide-line',
      title: 'คำแนะนำการรีวิว',
      number: 14,
      icon: AcademicCapIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ดูรายงานและสถิติการใช้งานระบบ',
        stepsguide: [
          'ความถูกต้องของข้อมูล (Accuracy) : ผู้เขียนรีวิวควรตรวจสอบข้อมูลก่อนเผยแพร่ให้ถูกต้องครบถ้วนและเป็นข้อเท็จจริงหลีกเลี่ยงการใส่ข้อมูลที่คลาดเคลื่อนทำให้เข้าใจผิดหรือยังไม่ได้รับการยืนยัน',
          'ความสุภาพและความเหมาะสม (Respect & Appropriate Language) : ใช้ถ้อยคำที่สุภาพเหมาะสมและไม่ใช้ภาษาที่หยาบคาย เสียดสี หรือลดทอนคุณค่าของผู้อื่นหลีกเลี่ยงคำพูดที่อาจก่อให้เกิดความขัดแย้งหรือสร้างความไม่พอใจแก่ผู้ที่เกี่ยวข้อง',
          'ความเป็นกลางและความยุติธรรม (Objectivity & Fairness) : นำเสนอความคิดเห็นบนพื้นฐานของประสบการณ์จริงและข้อเท็จจริงหลีกเลี่ยงการใส่อคติส่วนตัวหรือความรู้สึกด้านลบที่เกินความจำเป็นให้ข้อเสนอแนะอย่างเป็นกลางพร้อมระบุเหตุผลรองรับ',
          'ความชัดเจนและโครงสร้างที่เป็นระเบียบ (Clarity & Structure) : เขียนรีวิวด้วยประโยคที่ชัดเจนเข้าใจง่ายและมีลำดับขั้นตอนที่เป็นระบบหากมีหลายประเด็น ควรแบ่งหัวข้อหรือแยกย่อหน้าให้เหมาะสม',
          'การให้ข้อมูลที่เป็นประโยชน์ (Constructive & Helpful Feedback) : ระบุจุดเด่นและข้อควรปรับปรุงอย่างตรงไปตรงมาพร้อมคำแนะนำที่นำไปใช้ได้จริงเน้นการให้ข้อมูลที่ช่วยพัฒนาหรือปรับปรุงคุณภาพงาน บริการ หรือผลิตภัณฑ์',
          'ความรับผิดชอบต่อการเผยแพร่ข้อมูล (Responsibility) : ไม่เปิดเผยข้อมูลส่วนบุคคลหรือข้อมูลลับของผู้อื่นโดยไม่ได้รับอนุญาตเคารพกฎระเบียบของระบบและนโยบายความเป็นส่วนตัว',
          'ห้ามมีเนื้อหาที่ผิดกฎหมายหรือไม่เหมาะสม (Prohibited Content) : ห้ามเผยแพร่เนื้อหาที่ขัดต่อกฎหมาย เช่น การหมิ่นประมาท การคุกคาม การคัดลอกผลงานผู้อื่นโดยไม่ได้รับอนุญาตหลีกเลี่ยงเนื้อหาที่เกี่ยวข้องกับความรุนแรง ความเกลียดชัง หรือการเลือกปฏิบัติ',
        ],
        // dos: [
        //   'ใช้ภาษาสุภาพ',
        //   'ระบุข้อมูลพื้นฐาน เช่น เซค, เทอม, ปี, เกรด',
        //   'ให้ข้อมูลตามจริง',
        //   'แบ่งหัวข้อ เช่น ข้อดี / ข้อเสีย / คำแนะนำ'
        // ],
        // donts: [
        //   'ใช้คำหยาบคาย',
        //   'เผยแพร่ข้อมูลส่วนตัวของผู้อื่น',
        //   'ใส่ร้าย, ปั่นป่วน, ดิสเครดิต',
        //   'โฆษณาสินค้าหรือบริการที่ไม่เกี่ยวข้อง'
        // ],
        tips: 'ใช้รายงานเพื่อวิเคราะห์และพัฒนาระบบอย่างต่อเนื่อง',
      },
    },
  ];

  const adminSections = [
    {
      id: 'admin-dashboard',
      title: 'หน้าหลักผู้ดูแล',
      number: 1,
      icon: ShieldCheckIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'หน้าหลักสำหรับผู้ดูแลระบบในการจัดการเนื้อหาและตรวจสอบกิจกรรม',
        features: [
          'ภาพรวมสถิติการใช้งานระบบ',
          'การแจ้งเตือนเนื้อหาที่ต้องตรวจสอบ',
          'เมนูเข้าถึงฟังก์ชันการจัดการต่างๆ',
        ],
        images: [
          '../../assets/14.png',
          '../../assets/14.1.png',
        ],
        steps: [
          'เข้าสู่ระบบ (Login) ด้วยบัญชีผู้ดูแล',
          'ใช้เมนูด้านบนเพื่อไปยังหน้าต่าง ๆ : Home → กลับหน้าหลัก, Course → ดูรายวิชา, Guide → คู่มือการใช้งาน, Student Plan → วางแผนการเรียน',
          'ใช้ช่องค้นหารายวิชาเพื่อค้นหาวิชาที่ต้องการ',
          'เลื่อนดู Top 5 รายวิชายอดนิยม → คลิกเพื่อเข้าหน้ารายวิชา',
        ],
        tips: 'ตรวจสอบการแจ้งเตือนเป็นประจำเพื่อดูแลคุณภาพเนื้อหาในระบบ',
      },
    },
    {
      id: 'admin-course-list',
      title: 'หน้ารายวิชาผู้ดูแล',
      number: 2,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'จัดการและตรวจสอบรีวิวทั้งหมดในระบบ เพื่อรักษาคุณภาพและความเหมาะสม',
        features: [
          'ดูรีวิวทั้งหมดในระบบ',
          'ลบรีวิวที่ไม่เหมาะสม',
          'แก้ไขรีวิวที่มีข้อมูลผิดพลาด',
        ],
        images: [
          '../../assets/15.png',
          '../../assets/15.1.png',
        ],
        steps: [
          'จากเมนูด้านบน → คลิก Course',
          'ระบบจะแสดงหน้ารวมรายวิชา (Course List)',
        ],
        // dos: [
        //   'ลบรีวิวที่มีเนื้อหาไม่เหมาะสม เช่น ด่าทอ หมิ่นประมาท',
        //   'ลบรีวิวที่เป็นสแปมหรือโฆษณา',
        //   'แก้ไขข้อมูลที่ผิดพลาดชัดเจน',
        // ],
        // donts: [
        //   'ห้ามลบรีวิวที่วิพากษ์วิจารณ์อย่างสร้างสรรค์',
        //   'ห้ามแก้ไขความคิดเห็นของผู้ใช้โดยพลการ',
        //   'ห้ามใช้สิทธิ์เพื่อประโยชน์ส่วนตัว',
        // ],
        tips: 'ผู้ดูแลไม่สามารถโพสต์รีวิว กดไลค์ หรือดิสไลค์ได้ เพื่อรักษาความเป็นกลาง',
      },
    },
    {
      id: 'add-course',
      title: 'หน้าเพิ่มรายวิชา',
      number: 3,
      icon: ChatBubbleLeftRightIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'จัดการคำถามและคำตอบในระบบ เพื่อให้มีเนื้อหาที่มีคุณภาพ',
        features: [
          'ดูคำถามทั้งหมดในระบบ',
          'ลบคำถามที่ไม่เหมาะสม',
          'แก้ไขคำถามที่มีข้อมูลผิดพลาด',
        ],
        images: [
          '../../assets/16.png',
          '../../assets/16.1.png',
        ],
        steps: [
          'เข้าหน้านี้ได้จากสัญลักษณ์ “+” บนหน้าโฮมเพจ (Homepage) ตรงส่วนค้นหาข้อมูลรายวิชา',
          'กรอกข้อมูลรายวิชาใหม่',
          'กด “ยืนยัน” เพื่อเพิ่มรายวิชา / กดปุ่ม “ยกเลิก” เพื่อย้อนกลับ',
        ],
        // dos: [
        //   'ลบคำถามที่ซ้ำซ้อนหรือไม่เกี่ยวข้อง',
        //   'ลบคำตอบที่ให้ข้อมูลผิดหรือทำให้เข้าใจผิด',
        //   'แก้ไขข้อความผิดที่อาจสร้างความเข้าใจผิด',
        // ],
        // donts: [
        //   'ห้ามลบคำถามที่ถามอย่างจริงจัง แม้จะดูง่ายหรือซ้ำ',
        //   'ห้ามลบคำตอบที่แสดงมุมมองที่แตกต่าง',
        // ],
        tips: 'สนับสนุนให้มีการแลกเปลี่ยนความคิดเห็นอย่างสร้างสรรค์',
      },
    },
    {
      id: 'edit-course',
      title: 'หน้าแก้ไขรายวิชา',
      number: 4,
      icon: UserCircleIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง',
        features: [
          'ดูรายชื่อผู้ใช้ทั้งหมด',
          'ระงับหรือยกเลิกการระงับบัญชี',
          'ดูประวัติกิจกรรมของผู้ใช้',
        ],
        images: [
          '../../assets/17.png',
          '../../assets/17.1.png',
        ],
        steps: [
          'เข้าหน้านี้ได้จากสัญลักษณ์ดินสอ ✏️ ที่มุมบนของกล่องรายวิชาที่คุณต้องการแก้ไข',
          'แก้ไขข้อมูล เช่น ชื่อรายวิชา (Course) - รหัสรายวิชา (Course ID) - ชื่ออาจารย์ (Instructor) - รายละเอียด (Course Detail)',
          'กดปุ่ม “ยืนยัน” เพื่อบันทึก / กดปุ่ม “ลบ” เพื่อลบรายวิชา',
        ],
        // dos: [
        //   'ระงับบัญชีที่ละเมิดกฎอย่างร้ายแรง',
        //   'เตือนผู้ใช้ก่อนระงับบัญชีในกรณีที่ไม่ร้ายแรง',
        //   'บันทึกเหตุผลการระงับบัญชีทุกครั้ง',
        // ],
        // donts: [
        //   'ห้ามระงับบัญชีโดยไม่มีเหตุผลที่ชัดเจน',
        //   'ห้ามเปิดเผยข้อมูลส่วนตัวของผู้ใช้',
        // ],
        tips: 'ใช้ดุลยพินิจและความยุติธรรมในการตัดสินใจทุกครั้ง',
      },
    },
    {
      id: 'admin-review',
      title: 'หน้ารีวิวผู้ดูแล',
      number: 5,
      icon: BookOpenIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'จัดการข้อมูลรายวิชาในระบบให้เป็นปัจจุบัน',
        features: [
          'เพิ่มรายวิชาใหม่',
          'แก้ไขข้อมูลรายวิชา',
          'ลบรายวิชาที่ไม่ใช้แล้ว',
        ],
        images: [
          '../../assets/18.png',
        ],
        steps: [
          'กดสัญลักษณ์ “ถังขยะ” 🗑️ เพื่อลบโพสต์และความคิดเห็นของโพสต์รีวิวรายวิชาที่ไม่เหมาะสม',
        ],
        // dos: [
        //   'ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก',
        //   'อัปเดตข้อมูลอาจารย์ผู้สอนให้เป็นปัจจุบัน',
        //   'ใช้รหัสวิชาและชื่อที่เป็นทางการ',
        // ],
        // donts: [
        //   'ห้ามลบรายวิชาที่มีรีวิวอยู่',
        //   'ห้ามเปลี่ยนรหัสวิชาที่มีการใช้งานอยู่',
        // ],
        tips: 'ประสานงานกับทางมหาวิทยาลัยเพื่อข้อมูลที่ถูกต้อง',
      },
    },
    {
      id: 'admin-question',
      title: 'หน้าคำถามผู้ดูแล',
      number: 6,
      icon: AcademicCapIcon,
      color: 'from-purple-50 to-purple-50',
      content: {
        purpose: 'ดูรายงานและสถิติการใช้งานระบบ',
        features: [
          'สถิติจำนวนผู้ใช้งาน',
          'สถิติจำนวนรีวิวและคำถาม',
          'รายวิชายอดนิยม',
          'รายงานการใช้งานรายเดือน',
        ],
        images: [
          '../../assets/19.png'
        ],
        steps: [
          'กดสัญลักษณ์ “ถังขยะ” 🗑️ เพื่อลบโพสต์และความคิดเห็นของโพสต์คำถามรายวิชาที่ไม่เหมาะสม',
        ],
        tips: 'ใช้รายงานเพื่อวิเคราะห์และพัฒนาระบบอย่างต่อเนื่อง',
      },
    },
  ];

  const sections = userType === 'user' ? userSections : adminSections;
  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];

  // Reset to first section when changing user type
  const handleUserTypeChange = (newType) => {
    setUserType(newType);
    setActiveSection(newType === 'user' ? 'landing' : 'admin-dashboard');
  };

  return (
    <div className="flex min-h-screen bg-[#222831] font-kodchasan">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-30 w-80 bg-[#31363F] border-r border-[#76ABAE]/20 transition-transform duration-300 ease-in-out flex flex-col lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 mt-14 border-b border-[#76ABAE]/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">คู่มือการใช้งาน</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Type Dropdown */}
          <div className="relative">
            {/* <label className="block text-sm font-medium text-[#76ABAE] mb-2">คู่มือ</label> */}
            <div className="relative">
              <select
                value={userType}
                onChange={(e) => handleUserTypeChange(e.target.value)}
                className="bg-gradient-to-r from-[#26268c] to-[#42a5f5] w-full appearance-none text-white px-4 py-3 pr-10 rounded-lg transition-colors cursor-pointer"
              >
                <option className='text-black' value="user">ผู้ใช้</option>
                <option className='text-black' value="admin">ผู้ดูแล</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className=" flex-1 overflow-y-auto py-4 px-4 scrollbar-hide">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${activeSection === section.id
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-white shadow-lg'
                  : 'text-gray-300 hover:bg-[#3a4150] hover:text-white'
                  }`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 ${activeSection === section.id
                    ? 'bg-white text-[#f59e0b]'
                    : 'bg-[#3a4150] text-gray-400 group-hover:bg-[#4a5160]'
                    }`}
                >
                  {section.number}
                </span>
                <span className="flex-1 text-sm font-medium truncate">{section.title}</span>
                {activeSection === section.id && (
                  <ChevronRightIcon className="h-4 w-4 flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-80">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl">
            {/* Mobile Menu Button */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-20 bg-gradient-to-r from-[#f59e0b] to-[#fb923c] text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            {/* Section Header */}
            <div className={`bg-gradient-to-r ${currentSection.color} rounded-t-xl p-6`}>
              <div className="flex items-center justify-center space-x-4">
                {/* <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  {React.createElement(currentSection.icon, {
                    className: 'h-10 w-10 text-white',
                  })}
                </div> */}
                <div>
                  {/* <p className="text-black text-sm mb-1">หน้า {currentSection.number}</p> */}
                  <h2 className="text-2xl md:text-3xl font-bold text-black">
                    {currentSection.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Content Box */}
            <div className="bg-purple-50 rounded-b-xl p-6 space-y-6 shadow-xl">
              {/* Purpose */}
              {/* <div>
                <h3 className="text-black font-semibold mb-2 flex items-center text-lg">
                  <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                  วัตถุประสงค์:
                </h3>
                <p className="text-black leading-relaxed pl-4">{currentSection.content.purpose}</p>
              </div> */}

              {/* Features */}
              {/* {currentSection.content.features && (
                <div>
                  <h3 className="text-black font-semibold mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    {userType === 'admin' ? 'ฟังก์ชันหลัก:' : (currentSection.id === 'register' ? 'ให้ผู้ใช้ใหม่สร้างบัญชีเพื่อเข้าสู่ระบบ:' : 'สิ่งที่ผู้ใช้จะเห็น/ทำได้:')}
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {currentSection.content.features.map((feature, idx) => (
                      <li key={idx} className="text-black flex items-start">
                        <span className="text-black mr-3 mt-1.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              {/* Steps */}
              {currentSection.content.steps && (
                <div>
                  <h3 className="text-black font-semibold mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    วิธีการใช้งาน:
                  </h3>
                  <ol className="space-y-4 pl-4">
                    {currentSection.content.steps.map((step, idx) => (
                      <li key={idx} className="text-black">
                        <div className="flex items-start mb-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-black to-black rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </div>
                        {/* Image placeholder for each step */}
                        {currentSection.content.stepImages && currentSection.content.stepImages[idx] && (
                          <div className="ml-9 mt-2 mb-2">
                            <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden shadow-md">
                              <img
                                src={currentSection.content.stepImages[idx]}
                                alt={`ขั้นตอนที่ ${idx + 1}`}
                                className="w-full h-auto object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* step guide */}
              {currentSection.content.stepsguide && (
                <div>
                  <h3 className="text-black font-semibold mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    แนวทางปฏิบัติในการเขียนรีวิว (Review Guidelines)
                  </h3>
                  <ol className="space-y-4 pl-4">
                    {currentSection.content.stepsguide.map((step, idx) => (
                      <li key={idx} className="text-black">
                        <div className="flex items-start mb-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-black to-black rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </div>
                        {/* Image placeholder for each step */}
                        {currentSection.content.stepImages && currentSection.content.stepImages[idx] && (
                          <div className="ml-9 mt-2 mb-2">
                            <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden shadow-md">
                              <img
                                src={currentSection.content.stepImages[idx]}
                                alt={`ขั้นตอนที่ ${idx + 1}`}
                                className="w-full h-auto object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Images Gallery - แสดงรูปภาพต่อกันโดยไม่มีข้อความ */}
              {currentSection.content.images && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSection.content.images.map((image, idx) => (
                      <div key={idx} className="bg-black rounded-lg border-2 border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img
                          src={image}
                          alt={`ภาพประกอบ ${idx + 1}`}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Do's */}
              {currentSection.content.dos && (
                <div>
                  <h3 className="text-black font-semibold mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    ข้อปฏิบัติที่แนะนำ (ควรทำ):
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {currentSection.content.dos.map((item, idx) => (
                      <li key={idx} className="text-black flex items-start">
                        <span className="text-black mr-3 flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Don'ts */}
              {currentSection.content.donts && (
                <div>
                  <h3 className="text-black font-semibold mb-3 flex items-center text-lg">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    ข้อห้าม (ไม่ควรทำ):
                  </h3>
                  <ul className="space-y-2 pl-4">
                    {currentSection.content.donts.map((item, idx) => (
                      <li key={idx} className="text-black flex items-start">
                        <span className="text-black mr-3 flex-shrink-0">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tips */}
              {/* {currentSection.content.tips && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-5 border border-yellow-500/30">
                  <h3 className="text-yellow-400 font-semibold mb-2 flex items-center text-lg">
                    <span className="text-2xl mr-2">💡</span>
                    หมายเหตุ:
                  </h3>
                  <p className="text-black leading-relaxed">{currentSection.content.tips}</p>
                </div>
              )} */}
            </div>

            {/* Navigation Buttons */}
            {/* <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex((s) => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={sections.findIndex((s) => s.id === activeSection) === 0}
                className="px-6 py-2 bg-[#31363F] text-white rounded-lg hover:bg-[#3a4150] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← ก่อนหน้า
              </button>
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex((s) => s.id === activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1].id);
                  }
                }}
                disabled={
                  sections.findIndex((s) => s.id === activeSection) === sections.length - 1
                }
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ถัดไป →
              </button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Guide;