import { useRef, useState } from "react";
import { Code, Gamepad2, Share2, Tv, ArrowLeft, ArrowRight, ArrowUpLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function Categories() {
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const categories = [
    {
      title: "ألعاب الفيديو",
      description: "شحن شدات، كوينز، وبطاقات ألعاب بأفضل الأسعار.",
      Icon: Gamepad2,
      color: "bg-blue-500/10",
    },
    {
      title: "الاشتراكات الرقمية",
      description: "نتفلكس، يوتيوب بريميوم، وسبوتيفاي وغيرها.",
      Icon: Tv,
      color: "bg-purple-500/10",
    },
    {
      title: "وسائل التواصل",
      description: "زيادة متابعين، لايكات، ومشاهدات لحساباتك.",
      Icon: Share2,
      color: "bg-pink-500/10",
    },
    {
      title: "تطوير المواقع",
      description: "برمجة وتصميم مواقع ومتاجر إلكترونية احترافية.",
      Icon: Code,
      color: "bg-emerald-500/10",
    },
  ];

  return (
    <section id="categories" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-right flex-1">
            <h2 className="text-3xl md:text-5xl font-black mb-4 font-heading">
              أقسامنا <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">الرئيسية</span>
            </h2>
            <p className="text-muted-foreground text-lg font-sans max-w-xl">
              نقدم مجموعة واسعة من الخدمات الرقمية لتلبية كافة احتياجاتك
            </p>
          </div>
          
          <div className="flex gap-4" dir="ltr">
            <button 
              onClick={scrollLeft}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md text-primary transition-all hover:bg-primary/20 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary text-white transition-all hover:bg-primary/80 active:scale-95 shadow-[0_0_15px_rgba(255,0,122,0.3)]"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 -mx-4 px-4 md:-mx-6 md:px-6"
        >
          {categories.map((category, idx) => {
            const isActive = activeIndex === idx;
            
            return (
              <Link 
                to="/products" 
                key={idx} 
                className="block snap-start snap-always shrink-0"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
              >
                <Card
                  className={`relative group h-[340px] w-[260px] md:w-[280px] flex flex-col justify-end transition-all duration-300 ${
                    isActive 
                      ? "bg-primary border-primary text-white scale-[1.02] shadow-[0_10px_40px_rgba(255,0,122,0.3)] z-10" 
                      : "bg-card/40 backdrop-blur-xl border-white/10 hover:border-primary/30"
                  }`}
                >
                  <div className={`absolute top-6 left-6 p-2 rounded-lg border transition-colors ${
                    isActive ? "border-white/40 text-white" : "border-primary/30 text-primary group-hover:border-primary/60"
                  }`}>
                    <ArrowUpLeft className="h-5 w-5" />
                  </div>

                  <CardHeader className="pb-2 pt-16">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 shadow-inner ${
                        isActive ? "bg-white/10 border border-white/20" : `${category.color} border border-white/5`
                      }`}
                    >
                      <category.Icon className={`h-8 w-8 ${isActive ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <CardTitle className={`text-2xl font-heading ${isActive ? "text-white" : ""}`}>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className={`text-base font-sans line-clamp-3 ${isActive ? "text-white/90" : "text-muted-foreground"}`}>
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
