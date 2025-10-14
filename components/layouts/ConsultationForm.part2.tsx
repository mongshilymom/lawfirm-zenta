    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-parchment">상담 신청</h2>
        <p className="mb-6 text-sm text-slate-400">
          기본 정보를 입력하시면 AI 상담을 시작합니다
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-parchment">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="홍길동"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-parchment">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="example@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-parchment">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="010-1234-5678"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-parchment">
              상담 분야 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.legalIssue}
              onChange={(e) => setFormData({ ...formData, legalIssue: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-parchment focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="">선택해주세요</option>
              <option value="계약">계약/계약서 검토</option>
              <option value="부동산">부동산 분쟁</option>
              <option value="가족법">이혼/가족법</option>
              <option value="형사">형사 사건</option>
              <option value="노동">노동/고용</option>
              <option value="기업법무">기업 법무</option>
              <option value="지식재산">지식재산권</option>
              <option value="기타">기타</option>
            </select>
            {errors.legalIssue && (
              <p className="mt-1 text-xs text-red-400">{errors.legalIssue}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-amber-600 py-3 font-medium text-white hover:bg-amber-500 transition-colors"
          >
            상담 시작하기
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          입력하신 정보는 안전하게 보관되며 상담 목적으로만 사용됩니다
        </p>
      </div>
    </div>
  );
}
