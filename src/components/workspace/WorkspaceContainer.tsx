"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, History, Loader2, Sparkles } from "lucide-react";
import ProductForm from "./ProductForm";
import ResultsSection from "./ResultsSection";
import AuthModal from "./AuthModal";
import HistoryDrawer from "@/components/history/HistoryDrawer";
import { deleteHistoryItem, fetchUserHistory } from "@/app/history/actions";
import { SAMPLE_SCENARIOS, findSampleResult } from "./sampleScenarios";
import type {
  ContentFormInput,
  GeneratedContent,
  GenerationRecord,
} from "@/types/content";

export interface WorkspaceUser {
  credits?: number | null;
  email?: string | null;
}

interface WorkspaceContainerProps {
  user?: WorkspaceUser | null;
}

const EMPTY_FORM: ContentFormInput = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  tone: "trang-trong",
};

const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    input: {
      productName: "Áo sơ mi lụa tơ tằm dệt tay Bảo Lộc",
      productDescription:
        "Áo sơ mi may từ lụa tơ tằm nguyên chất dệt tay tại làng nghề Bảo Lộc, bề mặt mềm mịn, óng ả tự nhiên, thấm hút mồ hôi tốt, form suông thanh lịch phù hợp môi trường công sở và những buổi gặp gỡ quan trọng. Đường may tỉ mỉ, khuy vỏ trai, bền màu sau nhiều lần giặt nhẹ.",
      targetAudience:
        "Nữ chuyên viên văn phòng 28–45 tuổi, làm việc trong môi trường cần hình ảnh chỉn chu, ưu tiên chất liệu tự nhiên và phong cách tối giản.",
      tone: "trang-trong",
    },
    output: {
      captions: [
        {
          id: "sample-1-c1",
          angle: "Góc 1: Vấn đề & Giải pháp",
          text: `Áo sơ mi công sở thường đánh đổi giữa vẻ ngoài chỉn chu và cảm giác dễ chịu suốt tám tiếng làm việc. Chất liệu tổng hợp giữ form nhưng bí bách, còn vải mỏng nhẹ thì nhanh nhàu chỉ sau vài lần mặc.

Sơ mi lụa tơ tằm Bảo Lộc giải quyết đúng điểm giao đó: sợi tơ tự nhiên giữ phom suông đứng, bề mặt óng nhẹ dưới ánh đèn văn phòng, và khả năng thấm hút giúp bạn kết thúc ngày làm việc mà không phải chỉnh lại cổ áo.

Mỗi chiếc áo được dệt tay theo lô nhỏ, đường may bo gọn, khuy vỏ trai hoàn thiện thủ công — đủ trang nhã cho cuộc họp quan trọng, đủ thoải mái cho những ngày chỉ ngồi bên bàn phím.`,
        },
        {
          id: "sample-1-c2",
          angle: "Góc 2: Cảm xúc & Phong cách sống",
          text: `Có những món đồ không cần phô trương, chỉ cần đúng. Một chiếc sơ mi lụa buông nhẹ trên vai, tay áo xắn đến khuỷu, tách cà phê sáng bên cửa sổ — đó là cách người phụ nữ tinh tế bắt đầu ngày mới.

Lụa tơ tằm Bảo Lộc mềm theo từng chuyển động, mát khi tiết trời oi, ấm vừa đủ khi máy lạnh bật sâu. Chất liệu ấy không cần là xu hướng, bởi nó đã đứng ngoài xu hướng từ rất lâu.

Bạn không mặc để gây chú ý. Bạn mặc để thấy mình chỉn chu — với công việc, với người đối diện, và với chính mình.`,
        },
        {
          id: "sample-1-c3",
          angle: "Góc 3: Trực diện tính năng & Giá trị",
          text: `Thông số đáng chú ý của sơ mi lụa tơ tằm dệt tay Bảo Lộc:

• 100% lụa tơ tằm nguyên chất, dệt tay theo lô nhỏ tại Bảo Lộc.
• Bề mặt mềm mịn, óng ả tự nhiên, không phủ hóa chất tạo bóng.
• Thấm hút mồ hôi tốt, khô nhanh, hạn chế mùi sau ngày dài.
• Form suông thanh lịch, vai xuôi, phù hợp cả môi trường công sở lẫn dạo phố.
• Khuy vỏ trai, đường may bo gọn, bền màu qua nhiều lần giặt nhẹ.

Giá thành tương xứng với tuổi thọ sử dụng: một chiếc áo đúng chuẩn, mặc đẹp trong nhiều mùa, thay vì ba chiếc áo nhanh cũ.`,
        },
      ],
      headlines: [
        "Sơ mi lụa tơ tằm Bảo Lộc — chỉn chu từ chất liệu, không từ nhãn mác",
        "Mặc lụa dệt tay, giữ phom suông suốt ngày dài công sở",
        "Một chiếc áo đúng chất liệu, đủ tự tin cho mọi cuộc họp",
      ],
      hashtags: [
        "#somitotam",
        "#luabaoloc",
        "#thoitrangcongso",
        "#dosuathanhlich",
        "#thucongvietnam",
      ],
    },
  },
  {
    input: {
      productName: "Cà phê Robusta mộc Cầu Đất nguyên chất",
      productDescription:
        "Hạt Robusta trồng tại Cầu Đất, Đà Lạt, thu hoạch chín 90%, sơ chế mộc và rang mộc không tẩm ướp, giữ nguyên vị đắng đậm và hậu ngọt kéo dài. Đóng gói trong 48 giờ sau khi rang, hút chân không, có van thoát khí một chiều.",
      targetAudience:
        "Gen Z và dân văn phòng 22–32 tuổi, uống cà phê mỗi sáng, quan tâm đến nguồn gốc hạt và thích pha phin hoặc cold brew tại nhà.",
      tone: "tre-trung",
    },
    output: {
      captions: [
        {
          id: "sample-2-c1",
          angle: "Góc 1: Vấn đề & Giải pháp",
          text: `Sáng nào cũng một ly cà phê, nhưng uống mãi vẫn thấy nhạt? Vấn đề thường không nằm ở máy pha, mà ở hạt.

Cà phê Robusta mộc Cầu Đất được rang mộc, không tẩm bơ, không hương liệu. Vị đắng đến trước, hậu ngọt theo sau, đúng kiểu Robusta vùng cao nguyên — uống một lần là nhớ.

Hạt thu hoạch chín 90%, sơ chế mộc, đóng gói trong 48 giờ sau rang. Bạn chỉ cần một cái phin, ít nước sôi, và khoảng bốn phút kiên nhẫn.`,
        },
        {
          id: "sample-2-c2",
          angle: "Góc 2: Cảm xúc & Phong cách sống",
          text: `6 giờ 45 phút. Chưa mở laptop, chưa trả lời tin nhắn nào. Chỉ có phin cà phê nhỏ đang nhỏ giọt và một playlist không lời.

Người ta hay nói cà phê là thói quen. Nhưng có những thói quen đáng để giữ, nhất là khi nó bắt đầu bằng mùi Robusta mộc vừa rang — không ngọt gắt, không hương liệu, chỉ là mùi hạt thật.

Một gói 250g, một cái phin, một góc bàn cạnh cửa sổ. Ngày mới của bạn không cần phức tạp hơn thế.`,
        },
        {
          id: "sample-2-c3",
          angle: "Góc 3: Trực diện tính năng & Giá trị",
          text: `Nếu bạn quan tâm hạt cà phê mình uống đến từ đâu, đây là thông tin đầy đủ:

• Giống: Robusta trồng tại Cầu Đất, Đà Lạt, độ cao 1.500m.
• Thu hoạch: chín 90%, hái tay chọn lọc.
• Sơ chế: mộc (natural), phơi nắng tự nhiên.
• Rang: mộc, không bơ, không hương liệu, không chất tạo màu.
• Đóng gói: trong 48 giờ sau rang, hút chân không, van thoát khí một chiều.
• Pha phù hợp: phin, cold brew, moka pot.

Một gói 250g pha được khoảng 25 ly — tính ra chưa tới 10.000đ cho một ly cà phê đúng vị.`,
        },
      ],
      headlines: [
        "Robusta Cầu Đất rang mộc — đắng thật, ngọt thật, không hương liệu",
        "Hạt rang trong 48 giờ, pha phin tại nhà là có ly cà phê tử tế",
        "Bỏ hẳn cà phê tẩm bơ, bắt đầu từ một gói hạt mộc Cầu Đất",
      ],
      hashtags: [
        "#capheroblusta",
        "#cafecaudat",
        "#caphemoc",
        "#coldbrewathome",
        "#caphesang",
      ],
    },
  },
  {
    input: {
      productName: "Dầu gội bưởi bồ kết cô đặc hữu cơ",
      productDescription:
        "Dầu gội thảo mộc nấu đặc từ bồ kết, vỏ bưởi, sả chanh và hương nhu, không sulfate, không silicone, không paraben. Làm sạch dầu thừa, giảm gàu, giúp tóc mềm và lưu hương thơm tự nhiên suốt ngày.",
      targetAudience:
        "Nữ 25–40 tuổi có da đầu dầu, tóc mỏng hoặc đang tìm sản phẩm gội đầu lành tính, ưu tiên thành phần thảo mộc Việt Nam.",
      tone: "hai-huoc",
    },
    output: {
      captions: [
        {
          id: "sample-3-c1",
          angle: "Góc 1: Vấn đề & Giải pháp",
          text: `Tóc bạn không xấu. Tóc bạn chỉ đang phản đối việc bị gội bằng ba lớp hóa chất mỗi ngày.

Dầu gội bưởi bồ kết cô đặc hữu cơ nấu đặc từ bồ kết, vỏ bưởi, sả chanh và hương nhu — không sulfate, không silicone, không paraben. Da đầu sạch dầu, tóc mềm, và không còn cảnh gãi đầu giữa cuộc họp.

Nghe mùi thảo mộc lúc tắm còn dễ chịu hơn cả podcast bạn nghe mỗi sáng. Thử một chai thôi, đừng thử cả thùng — chúng tôi không muốn bạn phải đổi tủ đựng đồ.`,
        },
        {
          id: "sample-3-c2",
          angle: "Góc 2: Cảm xúc & Phong cách sống",
          text: `Có một khoảnh khắc rất đời: bạn cúi xuống, tóc chạm vai, và tự nhiên thấy mùi bưởi thoang thoảng. Không phải mùi nước hoa. Mùi bồ kết nấu với vỏ bưởi, kiểu mùi mà bà bạn từng dùng.

Chúng tôi không hứa bạn thành hot girl sau một lần gội. Chúng tôi chỉ hứa: da đầu sạch dầu, tóc mềm hơn, và mùi hương ở lại đủ lâu để người ngồi cạnh phải hỏi.

Tóc đẹp không cần phức tạp. Đôi khi chỉ cần đổi chai dầu gội.`,
        },
        {
          id: "sample-3-c3",
          angle: "Góc 3: Trực diện tính năng & Giá trị",
          text: `Bảng thành phần nói thay chúng tôi:

• Bồ kết — làm sạch dầu thừa, giảm gàu, giúp tóc suôn mượt.
• Vỏ bưởi — kháng khuẩn nhẹ, lưu hương tự nhiên.
• Sả chanh — làm sạch da đầu, giảm ngứa.
• Hương nhu — hỗ trợ mọc tóc, giảm rụng.
• Không sulfate, không silicone, không paraben.

Cô đặc gấp ba lần dầu gội thường nên chỉ cần một lượng nhỏ mỗi lần gội — chai 500ml dùng được khoảng hai tháng với người gội cách ngày.`,
        },
      ],
      headlines: [
        "Đổi chai dầu gội, đổi luôn mùi hương khiến đồng nghiệp phải hỏi",
        "Bồ kết, vỏ bưởi, sả chanh — không sulfate, không silicone",
        "Tóc mềm hơn sau một tuần, không cần thêm bước ủ nào",
      ],
      hashtags: [
        "#daugoibuoi",
        "#boket",
        "#daudauthaomoc",
        "#khongsulfate",
        "#tocchac",
      ],
    },
  },
];

function findSampleResult(input: ContentFormInput): GeneratedContent | null {
  const normalizedName = input.productName.trim().toLowerCase();
  const matched = SAMPLE_SCENARIOS.find(
    (scenario) =>
      scenario.input.productName.trim().toLowerCase() === normalizedName,
  );
  return matched ? matched.output : null;
}

export default function WorkspaceContainer({ user }: WorkspaceContainerProps) {
  const [formInputs, setFormInputs] = useState<ContentFormInput>(EMPTY_FORM);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<GenerationRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const sampleIndexRef = useRef(0);
  const generateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        const form = document.getElementById("product-form");
        if (form instanceof HTMLFormElement) {
          event.preventDefault();
          form.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const [credits, setCredits] = useState<number | null>(user?.credits ?? null);

  const refreshHistorySilently = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetchUserHistory();
      if (!res.error) setHistoryItems(res.data ?? []);
    } catch {
      // Làm mới ngầm thất bại không được chặn luồng tạo nội dung.
    }
  }, [user]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetchUserHistory();
      if (res.error) {
        setHistoryError(res.error);
        setHistoryItems([]);
      } else {
        setHistoryItems(res.data ?? []);
      }
    } catch {
      setHistoryError("Không thể tải lịch sử bài viết. Vui lòng thử lại.");
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  const handleOpenHistory = useCallback(() => {
    if (!user) {
      showToast("Đăng nhập để xem và quản lý lịch sử bài viết đã tạo.");
      return;
    }
    setHistoryOpen(true);
    void loadHistory();
  }, [user, showToast, loadHistory]);

  const handleCloseHistory = useCallback(() => {
    setHistoryOpen(false);
  }, []);

  const handleRestore = useCallback(
    (record: GenerationRecord) => {
      setFormInputs({
        productName: record.productName,
        productDescription: record.productDescription,
        targetAudience: record.targetAudience,
        tone: record.tone,
      });
      setResult({
        captions: record.captions,
        headlines: record.headlines,
        hashtags: record.hashtags,
      });
      setHistoryOpen(false);
      showToast(`Đã khôi phục bài viết: ${record.productName}`);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [showToast],
  );

  const handleDeleteHistoryItem = useCallback(
    async (id: string): Promise<boolean> => {
      const snapshot = historyItems;
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));

      try {
        const res = await deleteHistoryItem(id);
        if (!res.success) {
          setHistoryItems(snapshot);
          showToast(res.error ?? "Không thể xóa bài viết. Vui lòng thử lại.");
          return false;
        }
        showToast("Đã xóa bài viết khỏi lịch sử");
        return true;
      } catch {
        setHistoryItems(snapshot);
        showToast("Mất kết nối khi xóa. Bài viết đã được khôi phục.");
        return false;
      }
    },
    [historyItems, showToast],
  );

  const generate = useCallback(
    async (input: ContentFormInput, successMessage: string) => {
      setLoading(true);

      // Nếu chưa đăng nhập:
      if (!user) {
        const sample = findSampleResult(input);
        if (sample) {
          if (generateTimerRef.current) clearTimeout(generateTimerRef.current);
          generateTimerRef.current = setTimeout(() => {
            setResult(sample);
            setLoading(false);
            showToast("Đang xem dữ liệu mẫu. Đăng nhập để AI tạo bài viết riêng.");
          }, 400);
          return;
        }

        // Với sản phẩm do người dùng tự gõ -> Yêu cầu đăng nhập, không dùng văn mẫu giả lập!
        setLoading(false);
        setAuthModalOpen(true);
        showToast("Vui lòng đăng nhập để AI tạo bài viết cho sản phẩm này.");
        return;
      }

      // Nếu đã đăng nhập: Gọi API /api/generate thật
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const resData = await response.json();

        if (!response.ok) {
          if (typeof resData?.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
          }
          throw new Error(resData?.error || "Không thể tạo nội dung từ AI.");
        }

        if (resData.success && resData.data) {
          setResult(resData.data);
          if (typeof resData.creditsRemaining === "number") {
            setCredits(resData.creditsRemaining);
          }
          showToast(successMessage);
          void refreshHistorySilently();
        } else {
          throw new Error("Phản hồi từ AI không đúng cấu trúc.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Đã xảy ra lỗi khi gọi AI.";
        showToast(msg);
      } finally {
        setLoading(false);
      }
      },
      [user, showToast, refreshHistorySilently],
    );

  const handleSubmit = () => {
    generate(formInputs, "Đã tạo 3 góc bài viết thành công!");
  };

  const handleRegenerate = () => {
    if (loading || !result) return;
    generate(formInputs, "Đã tạo lại nội dung thành công!");
  };

  const handleLoadSample = () => {
    const scenario =
      SAMPLE_SCENARIOS[sampleIndexRef.current % SAMPLE_SCENARIOS.length];
    sampleIndexRef.current += 1;
    setFormInputs(scenario.input);
    setResult(scenario.output);
    showToast(`Đã nạp dữ liệu mẫu: ${scenario.input.productName}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:py-8 md:pb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[15px] font-semibold tracking-tight text-[var(--ink-primary)]">
            Không gian sáng tạo
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--ink-secondary)]">
            Nhập thông tin sản phẩm, nhận về 3 góc bài viết tối ưu.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenHistory}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--ink-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--ink-primary)]"
        >
          <History className="h-3.5 w-3.5" />
          Lịch sử
        </button>
      </div>

      <div className="flex flex-col items-start gap-5 lg:flex-row lg:gap-6">
        <aside className="w-full shrink-0 lg:sticky lg:top-[72px] lg:w-[420px]">
          <ProductForm
            value={formInputs}
            onChange={setFormInputs}
            onSubmit={handleSubmit}
            onLoadSample={handleLoadSample}
            loading={loading}
          />

          <p className="mt-2 text-center text-[12px] text-[var(--ink-tertiary)]">
            {typeof credits === "number" ? (
              <>
                Còn{" "}
                <span className="font-semibold tabular-nums text-[var(--ink-secondary)]">
                  {credits}
                </span>{" "}
                lượt tạo trong tài khoản của bạn
              </>
            ) : (
              "Đăng nhập để lưu lịch sử nội dung đã tạo"
            )}
          </p>
        </aside>

        <section className="w-full min-w-0 flex-1">
          <ResultsSection
            result={result}
            loading={loading}
            onRegenerate={handleRegenerate}
            onNotify={showToast}
          />
        </section>
      </div>

      <HistoryDrawer
        open={historyOpen}
        loading={historyLoading}
        error={historyError}
        items={historyItems}
        onClose={handleCloseHistory}
        onRestore={handleRestore}
        onDelete={handleDeleteHistoryItem}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        productName={formInputs.productName}
      />

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border-subtle)] bg-white/95 px-4 py-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-[var(--ink-tertiary)]">
              {typeof credits === "number" ? (
                <>
                  Còn{" "}
                  <span className="font-semibold tabular-nums text-[var(--ink-primary)]">
                    {credits}
                  </span>{" "}
                  lượt tạo
                </>
              ) : (
                "Đăng nhập để lưu lịch sử"
              )}
            </p>
          </div>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-navy-hover)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{loading ? "Đang tạo..." : "Tạo 3 góc"}</span>
          </button>
        </div>
      </div>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4 md:bottom-6">
          <div
            role="status"
            aria-live="polite"
            className="flex max-w-full items-center gap-2 rounded-lg bg-[var(--ink-primary)] px-3 py-2 text-[12px] font-medium text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
            <span className="min-w-0 break-words">{toast}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}