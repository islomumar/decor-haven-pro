import { Award, Users, Package, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function About() {
  const { language, t } = useLanguage();

  const stats = [
    { icon: Award, value: '10+', label: t.about.stats.years },
    { icon: Package, value: '5000+', label: t.about.stats.products },
    { icon: Users, value: '3000+', label: t.about.stats.customers },
    { icon: MapPin, value: '12+', label: t.about.stats.cities },
  ];

  const team = [
    { name: 'Akbar Rahimov', role: language === 'uz' ? 'Asoschisi va direktor' : 'Основатель и директор', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
    { name: 'Sardor Karimov', role: language === 'uz' ? 'Bosh dizayner' : 'Главный дизайнер', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
    { name: 'Nilufar Azimova', role: language === 'uz' ? 'Sotish bo\'limi boshlig\'i' : 'Руководитель отдела продаж', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
            alt="Workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">{t.about.title}</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {language === 'uz' 
              ? "10 yildan ortiq tajriba bilan Toshkentning eng yaxshi mebel ishlab chiqaruvchilaridan biri"
              : "Один из лучших производителей мебели в Ташкенте с более чем 10-летним опытом"
            }
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-2xl shadow-warm">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">{t.about.story}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t.about.storyText}</p>
              <p className="text-muted-foreground leading-relaxed">
                {language === 'uz'
                  ? "Biz kichik ustaxonadan boshlab, bugungi kunda zamonaviy ishlab chiqarish liniyalariga ega katta korxonaga aylandik. Har bir mahsulotimizda sifat va ehtiyotkorlik aks etadi."
                  : "Мы начинали с небольшой мастерской и сегодня превратились в крупное предприятие с современными производственными линиями. В каждом нашем изделии отражается качество и забота."
                }
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800"
                alt="Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-warm">
              <h3 className="font-serif text-2xl font-bold mb-4">{t.about.mission}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.about.missionText}</p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-warm">
              <h3 className="font-serif text-2xl font-bold mb-4">{t.about.values}</h3>
              <p className="text-muted-foreground leading-relaxed">{t.about.valuesText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">
            {language === 'uz' ? 'Bizning jamoa' : 'Наша команда'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-medium text-lg">{member.name}</h4>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">
            {language === 'uz' ? 'Ishlab chiqarish jarayoni' : 'Процесс производства'}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: language === 'uz' ? 'Konsultatsiya' : 'Консультация', desc: language === 'uz' ? 'Sizning talablaringizni o\'rganamiz' : 'Изучаем ваши требования' },
              { step: '02', title: language === 'uz' ? 'Dizayn' : 'Дизайн', desc: language === 'uz' ? '3D loyiha tayyorlaymiz' : 'Готовим 3D проект' },
              { step: '03', title: language === 'uz' ? 'Ishlab chiqarish' : 'Производство', desc: language === 'uz' ? 'Sifatli materiallardan yasaymiz' : 'Изготавливаем из качественных материалов' },
              { step: '04', title: language === 'uz' ? 'Yetkazib berish' : 'Доставка', desc: language === 'uz' ? 'O\'rnatib beramiz' : 'Доставляем и устанавливаем' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-serif text-2xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-medium mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
