import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Code2,
  Terminal,
  Mail,
  MessageCircle,
  ArrowUpRight
} from 'lucide-react';

/**
 * Team Showcase — 2 developers side-by-side in one row.
 * Each profile = tall photo card (left) + 4 personal info tiles in a 2x2 grid (right).
 *
 * NOTE: Contact / student-ID values below are placeholders — replace with real data.
 */
const TEAM = [
  {
    key: 'frontend',
    name: 'อภิรักษ์ ธรรมแก้ว',
    role: 'Frontend Developer',
    photo: '/img/team_dream.jpg',
    index: '01',
    education: {
      id: '681310025',
      major: 'วิทยาการคอมพิวเตอร์และสารสนเทศ'
    },
    responsibility: {
      title: 'Frontend Architect & UX Lead',
      desc: 'ออกแบบ UI/UX, Data Visualization และสถาปัตยกรรม SPA'
    },
    skills: {
      icon: Code2,
      title: 'React 19 & Modern SPA',
      tags: ['React 19', 'Vite', 'Recharts', 'Lucide']
    },
    contact: {
      email: 'apirak.tham@zonezet.dev',
      github: '@apirak-th',
      line: 'dream.apirak'
    }
  },
  {
    key: 'backend',
    name: 'อนุพงค์ พลจันทึก',
    role: 'Backend Developer',
    photo: '/img/team_noor.jpg',
    index: '02',
    education: {
      id: '681310xxx',
      major: 'วิทยาการคอมพิวเตอร์และสารสนเทศ'
    },
    responsibility: {
      title: 'Backend & Distributed Systems',
      desc: 'พัฒนา Express API Gateway, Caching และ Data Pipeline'
    },
    skills: {
      icon: Terminal,
      title: 'Node.js & Express Engine',
      tags: ['Node.js', 'Express', 'REST API', 'Cache']
    },
    contact: {
      email: 'anupong.pol@zonezet.dev',
      github: '@anupong-pol',
      line: 'noor.anupong'
    }
  }
];

const SOCIAL_ICONS = [
  {
    label: 'LinkedIn',
    href: '#linkedin',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74V9.92H5.06v8.58h2.8z'
  },
  {
    label: 'GitHub',
    href: '#github',
    path: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z'
  },
  {
    label: 'Facebook',
    href: '#facebook',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
  },
  {
    label: 'Twitter',
    href: '#twitter',
    path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
  }
];

function DevProfile({ dev }) {
  const SkillIcon = dev.skills.icon;

  return (
    <article className={`tm-profile tm-${dev.key} reveal-on-scroll ${dev.key === 'frontend' ? 'reveal-delay-1' : 'reveal-delay-2'}`}>
      <div className="tm-profile-glow" aria-hidden="true" />

      {/* Photo card (left) */}
      <div className="single-team_item tm-photo">
        <div className="team_thumb tm-photo-frame">
          <img src={dev.photo} alt={dev.name} className="team-member-photo" />
          <div className="tm-photo-shade" />
          <div className="team-shine-sweep" />

          <div className="team_social">
            <ul>
              {SOCIAL_ICONS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} title={s.label} aria-label={s.label}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <span className="tm-photo-index">{dev.index}</span>

          <div className="tm-photo-caption">
            <span className="tm-role-chip">
              <span className="tm-role-dot" />
              {dev.role}
            </span>
            <h3 className="tm-name">{dev.name}</h3>
          </div>
        </div>
      </div>

      {/* 4 personal info tiles (right, 2x2) */}
      <div className="tm-tiles">
        {/* Education */}
        <div className="tm-tile">
          <div className="tm-tile-top">
            <span className="tm-tile-icon"><GraduationCap size={18} /></span>
            <span className="tm-tile-label">Education</span>
          </div>
          <div className="tm-tile-body">
            <p className="tm-tile-kicker">รหัสนักศึกษา</p>
            <p className="tm-tile-value tm-mono">{dev.education.id}</p>
            <p className="tm-tile-desc">{dev.education.major}</p>
          </div>
        </div>

        {/* Responsibility */}
        <div className="tm-tile">
          <div className="tm-tile-top">
            <span className="tm-tile-icon"><Briefcase size={18} /></span>
            <span className="tm-tile-label">Responsibility</span>
          </div>
          <div className="tm-tile-body">
            <p className="tm-tile-kicker">หน้าที่รับผิดชอบ</p>
            <p className="tm-tile-value">{dev.responsibility.title}</p>
            <p className="tm-tile-desc">{dev.responsibility.desc}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="tm-tile">
          <div className="tm-tile-top">
            <span className="tm-tile-icon"><SkillIcon size={18} /></span>
            <span className="tm-tile-label">Expertise</span>
          </div>
          <div className="tm-tile-body">
            <p className="tm-tile-kicker">ทักษะความเชี่ยวชาญ</p>
            <p className="tm-tile-value">{dev.skills.title}</p>
            <div className="tm-tags">
              {dev.skills.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="tm-tile tm-tile-contact">
          <div className="tm-tile-top">
            <span className="tm-tile-icon"><Mail size={18} /></span>
            <span className="tm-tile-label">Contact</span>
          </div>
          <div className="tm-tile-body">
            <a className="tm-contact-row" href={`mailto:${dev.contact.email}`}>
              <Mail size={13} />
              <span>{dev.contact.email}</span>
              <ArrowUpRight size={13} className="tm-contact-arrow" />
            </a>
            <div className="tm-contact-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={SOCIAL_ICONS[1].path} />
              </svg>
              <span>{dev.contact.github}</span>
            </div>
            <div className="tm-contact-row">
              <MessageCircle size={13} />
              <span>Line: {dev.contact.line}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TeamShowcase() {
  return (
    <div className="tm-grid">
      {TEAM.map((dev) => (
        <DevProfile key={dev.key} dev={dev} />
      ))}
    </div>
  );
}
