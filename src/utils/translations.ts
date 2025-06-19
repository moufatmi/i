export type Language = 'en' | 'ar' | 'fr' | 'zh';

export const translations = {
  en: {
    // Common
    welcome: 'Welcome to Agence de Voyage!',
    dashboard: 'Dashboard',
    settings: 'Settings',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Agent Portal
    agentDashboard: 'Agent Dashboard',
    createInvoice: 'Create Invoice',
    directorAccess: 'Director Access',
    createAndManage: 'Create and manage client invoices efficiently',
    todaysActivity: "Today's Activity",
    performance: 'Performance',
    quickTip: 'Quick Tip',
    recentInvoices: 'Your Recent Invoices',
    readyToStart: 'Ready to get started?',
    createFirstInvoice: 'Create your first invoice to begin tracking your client billing.',
    createYourFirst: 'Create Your First Invoice',
    
    // Invoice Form
    createNewInvoice: 'Create New Invoice',
    fillDetails: 'Fill in the details to generate an invoice for your client',
    clientInformation: 'Client Information',
    clientName: 'Client Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    dueDate: 'Due Date',
    address: 'Address',
    servicesItems: 'Services & Items',
    addItem: 'Add Item',
    serviceDescription: 'Service/Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    total: 'Total',
    invoiceSummary: 'Invoice Summary',
    subtotal: 'Subtotal',
    tax: 'Tax',
    additionalNotes: 'Additional Notes',
    saveAsDraft: 'Save as Draft',
    createAndSend: 'Create & Send',
    
    // Settings
    settingsTitle: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    selectLanguage: 'Select Language',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    chinese: '中文',
    
    // Invoice Status
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
    
    // Dashboard Stats
    totalRevenue: 'Total Revenue',
    totalInvoices: 'Total Invoices',
    pending: 'Pending',
    
    // Tips
    followUpTip: 'Follow up on pending invoices within 3 days to improve your collection rate and maintain good client relationships.',
  },
  
  ar: {
    // Common
    welcome: 'مرحباً بك في وكالة السفر!',
    dashboard: 'لوحة التحكم',
    settings: 'الإعدادات',
    save: 'حفظ',
    cancel: 'إلغاء',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    
    // Agent Portal
    agentDashboard: 'لوحة تحكم الوكيل',
    createInvoice: 'إنشاء فاتورة',
    directorAccess: 'وصول المدير',
    createAndManage: 'إنشاء وإدارة فواتير العملاء بكفاءة',
    todaysActivity: 'نشاط اليوم',
    performance: 'الأداء',
    quickTip: 'نصيحة سريعة',
    recentInvoices: 'فواتيرك الأخيرة',
    readyToStart: 'مستعد للبدء؟',
    createFirstInvoice: 'أنشئ فاتورتك الأولى لبدء تتبع فواتير العملاء.',
    createYourFirst: 'أنشئ فاتورتك الأولى',
    
    // Invoice Form
    createNewInvoice: 'إنشاء فاتورة جديدة',
    fillDetails: 'املأ التفاصيل لإنشاء فاتورة لعميلك',
    clientInformation: 'معلومات العميل',
    clientName: 'اسم العميل',
    emailAddress: 'عنوان البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف',
    dueDate: 'تاريخ الاستحقاق',
    address: 'العنوان',
    servicesItems: 'الخدمات والعناصر',
    addItem: 'إضافة عنصر',
    serviceDescription: 'الخدمة/الوصف',
    quantity: 'الكمية',
    unitPrice: 'سعر الوحدة',
    total: 'المجموع',
    invoiceSummary: 'ملخص الفاتورة',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    additionalNotes: 'ملاحظات إضافية',
    saveAsDraft: 'حفظ كمسودة',
    createAndSend: 'إنشاء وإرسال',
    
    // Settings
    settingsTitle: 'الإعدادات',
    appearance: 'المظهر',
    theme: 'السمة',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    chinese: '中文',
    
    // Invoice Status
    draft: 'مسودة',
    sent: 'مرسل',
    paid: 'مدفوع',
    overdue: 'متأخر',
    
    // Dashboard Stats
    totalRevenue: 'إجمالي الإيرادات',
    totalInvoices: 'إجمالي الفواتير',
    pending: 'معلق',
    
    // Tips
    followUpTip: 'تابع الفواتير المعلقة خلال 3 أيام لتحسين معدل التحصيل والحفاظ على علاقات جيدة مع العملاء.',
  },
  
  fr: {
    // Common
    welcome: 'Bienvenue chez Agence de Voyage!',
    dashboard: 'Tableau de bord',
    settings: 'Paramètres',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    
    // Agent Portal
    agentDashboard: 'Tableau de bord Agent',
    createInvoice: 'Créer une facture',
    directorAccess: 'Accès Directeur',
    createAndManage: 'Créer et gérer efficacement les factures clients',
    todaysActivity: "Activité d'aujourd'hui",
    performance: 'Performance',
    quickTip: 'Conseil rapide',
    recentInvoices: 'Vos factures récentes',
    readyToStart: 'Prêt à commencer?',
    createFirstInvoice: 'Créez votre première facture pour commencer à suivre la facturation client.',
    createYourFirst: 'Créez votre première facture',
    
    // Invoice Form
    createNewInvoice: 'Créer une nouvelle facture',
    fillDetails: 'Remplissez les détails pour générer une facture pour votre client',
    clientInformation: 'Informations client',
    clientName: 'Nom du client',
    emailAddress: 'Adresse e-mail',
    phoneNumber: 'Numéro de téléphone',
    dueDate: 'Date d\'échéance',
    address: 'Adresse',
    servicesItems: 'Services et articles',
    addItem: 'Ajouter un article',
    serviceDescription: 'Service/Description',
    quantity: 'Quantité',
    unitPrice: 'Prix unitaire',
    total: 'Total',
    invoiceSummary: 'Résumé de la facture',
    subtotal: 'Sous-total',
    tax: 'Taxe',
    additionalNotes: 'Notes supplémentaires',
    saveAsDraft: 'Enregistrer comme brouillon',
    createAndSend: 'Créer et envoyer',
    
    // Settings
    settingsTitle: 'Paramètres',
    appearance: 'Apparence',
    theme: 'Thème',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    language: 'Langue',
    selectLanguage: 'Sélectionner la langue',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    chinese: '中文',
    
    // Invoice Status
    draft: 'Brouillon',
    sent: 'Envoyé',
    paid: 'Payé',
    overdue: 'En retard',
    
    // Dashboard Stats
    totalRevenue: 'Revenus totaux',
    totalInvoices: 'Total des factures',
    pending: 'En attente',
    
    // Tips
    followUpTip: 'Suivez les factures en attente dans les 3 jours pour améliorer votre taux de recouvrement et maintenir de bonnes relations clients.',
  },
  
  zh: {
    // Common
    welcome: '欢迎来到旅行社！',
    dashboard: '仪表板',
    settings: '设置',
    save: '保存',
    cancel: '取消',
    close: '关闭',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    
    // Agent Portal
    agentDashboard: '代理仪表板',
    createInvoice: '创建发票',
    directorAccess: '主管访问',
    createAndManage: '高效创建和管理客户发票',
    todaysActivity: '今日活动',
    performance: '表现',
    quickTip: '快速提示',
    recentInvoices: '您的最近发票',
    readyToStart: '准备开始了吗？',
    createFirstInvoice: '创建您的第一张发票以开始跟踪客户账单。',
    createYourFirst: '创建您的第一张发票',
    
    // Invoice Form
    createNewInvoice: '创建新发票',
    fillDetails: '填写详细信息为您的客户生成发票',
    clientInformation: '客户信息',
    clientName: '客户姓名',
    emailAddress: '电子邮件地址',
    phoneNumber: '电话号码',
    dueDate: '到期日期',
    address: '地址',
    servicesItems: '服务和项目',
    addItem: '添加项目',
    serviceDescription: '服务/描述',
    quantity: '数量',
    unitPrice: '单价',
    total: '总计',
    invoiceSummary: '发票摘要',
    subtotal: '小计',
    tax: '税费',
    additionalNotes: '附加说明',
    saveAsDraft: '保存为草稿',
    createAndSend: '创建并发送',
    
    // Settings
    settingsTitle: '设置',
    appearance: '外观',
    theme: '主题',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    language: '语言',
    selectLanguage: '选择语言',
    english: 'English',
    arabic: 'العربية',
    french: 'Français',
    chinese: '中文',
    
    // Invoice Status
    draft: '草稿',
    sent: '已发送',
    paid: '已付款',
    overdue: '逾期',
    
    // Dashboard Stats
    totalRevenue: '总收入',
    totalInvoices: '总发票数',
    pending: '待处理',
    
    // Tips
    followUpTip: '在3天内跟进待处理的发票，以提高您的收款率并维护良好的客户关系。',
  },
};

export const useTranslation = (language: Language) => {
  return {
    t: (key: keyof typeof translations.en): string => {
      return translations[language][key] || translations.en[key] || key;
    }
  };
};