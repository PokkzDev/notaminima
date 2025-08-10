Nota Mínima — Project README

**Domain**: notaminima.cl

**Goal**: Free, fast, single‑player calculator to find nota mínima to pass/exempt and convert puntaje→nota with exigencia. Optimized for Chilean 1.0–7.0 scale and SEO.

## Table of Contents
- [Overview](#overview)
- [Features (v0 — MVP)](#features-v0--mvp)
- [Site Structure](#site-structure)
- [SEO: Titles & Metas](#seo-titles--metas)
- [Keyword Targets](#keyword-targets)
- [FAQ Suggestions](#faq-suggestions)
- [On‑Page Checklist](#on-page-checklist)
- [Branding](#branding)
- [Initial Content Ideas](#initial-content-ideas)
- [Monetization](#monetization)
- [Measurement](#measurement)
- [Launch Plan](#launch-plan)
- [Tech Notes](#tech-notes)
- [Roadmap (v1+)](#roadmap-v1)

## Overview
Nota Mínima is a free, fast calculator to:
- Calculate the minimum grade needed to pass or get exempted
- Convert raw points to Chilean grades (1.0–7.0) with configurable exigencia

## Features (v0 — MVP)
- **Single‑page flow**: Course → Evaluations → Result
- **Evaluations input**: name, optional date, weight %, and either:
  - current grade (1.0–7.0), or
  - raw points (auto‑converted via scale)
- **Escala de notas** (default per course + override por evaluación):
  - total points selector (60, 90, 100, custom)
  - exigencia % editable (e.g., 60% ⇒ nota 4.0)
  - linear mapping: 0% → 1.0, exigencia% → 4.0, 100% → 7.0
- **Live helper**: “X/Y pts = Z% ⇒ nota N.N”
- **Basic rules**: custom pass threshold (4.0/4.5/etc.), exam minimum, optional exemption threshold
- **What‑if simulator**: edit remaining points or grade and see impact instantly
- **Result card**: weighted average, needed grade/points to pass/exempt, traffic‑light status, 3 short tips
- **Persistence**: localStorage (no login)
- **Export**: ICS calendar (evaluation dates + reminders)
- **Monetization**: one ad slot on Result + consent banner
- **Demo preset**: prefilled course from the hero
- **Validation**: weights sum to 100; grades 1.0–7.0; points within total; valid dates

## Site Structure
- **/**: Home (calculadora principal “nota mínima”)
- **/puntaje-a-nota**: Convertir puntos→nota (60/90/100 + exigencia)
- **/eximicion**: Calculadora para eximirse
- **/escala-60**: Plantilla rápida “exigencia 60%”
- **/faq**: Preguntas frecuentes
- **/privacidad**, **/terminos**

## SEO: Titles & Metas
- **Home (/)**
  - **Title**: Calcula tu Nota Mínima para Aprobar | 1.0–7.0 Chile
  - **Meta description**: Ingresa tus evaluaciones y peso. Calcula la nota mínima para aprobar o eximir y convierte puntaje a nota con exigencia (60%, 70%). Gratis y sin registro.
- **/puntaje-a-nota**
  - **Title**: Puntaje a Nota (60/90/100 puntos) | Exigencia 60%
  - **Meta description**: Convierte X/Y puntos a nota chilena 1.0–7.0. Ajusta exigencia y total de preguntas.
- **/eximicion**
  - **Title**: ¿Me eximo del examen? Calculadora de Eximición
  - **Meta description**: Simula promedio parcial, reglas y mínimo de examen para saber si te eximes.

**H1 guidance**: Repetir el intento en cada página (ej., “Calculadora de Nota Mínima 1.0–7.0”).

**Schema**: Agregar FAQPage donde aplique y WebApplication (o SoftwareApplication) en `/` con name, description, country “CL”.

## Keyword Targets
- **nota mínima para aprobar / para eximirse**
- **cuánto necesito en el examen**
- **convertir puntaje a nota / escala 1.0–7.0**
- **exigencia 60% / 70%**
- **nota 4.0 con exigencia / qué necesito para 4,5**

## FAQ Suggestions
- ¿Cómo se calcula la nota mínima con una exigencia del 60%?
- ¿Qué significa eximirse del examen?
- ¿Cómo convertir puntos a nota en una prueba de 60/90/100?
- ¿Puedo quitar la peor nota o reemplazar con recuperativo?

## On‑Page Checklist
- **Canonical** por página, `sitemap.xml` y `robots.txt`
- **Open Graph + Twitter cards** (título = keyword)
- **Schema**: FAQPage en `/faq` y WebApplication en `/`
- **LCP < 2.5s** (imágenes livianas; no bloquear main thread)
- **hreflang** `es-CL`
- **Core Web Vitals** en verde

## Branding
- **Nombre mostrado**: Nota Mínima
- **Tagline**: “Calcula lo que necesitas, sin enredos.”
- **Tono**: directo, académico‑amigable
- **Visual**: limpio; acentos verde/ámbar/rojo (semáforo)

## Initial Content Ideas
- Cómo calcular la nota mínima para aprobar (1.0–7.0) con ejemplos
- De puntaje a nota: guía para pruebas de 60/90/100 (exigencia 60%)
- ¿Te eximes del examen? Reglas típicas y calculadora paso a paso

## Monetization
- **Ads**: Un bloque responsivo solo en Result
- **Aplicación a AdSense**: después de publicar Home + 2–3 páginas útiles
- **Consentimiento**: claro; sin anuncios en formularios ni PDFs

## Measurement
- **Plausible (sin cookies)** — eventos: `start_calc`, `result_view`, `ics_export`
- **Google Search Console** — sitemap, inspección de URLs clave

## Launch Plan (1–2 días)
- Home con calculadora básica + demo
- `/puntaje-a-nota` funcionando (60/90/100 + exigencia 60%)
- `/faq` con 4–6 preguntas
- Sitemap/robots, OG tags, GSC verificado
- Reels cortos: “¿Cuánto necesito en el examen?” con link a `notaminima.cl`

## Tech Notes
- **JS only**, no SSR (static export o client‑side pages)
- **State** en `localStorage`
- **ICS** generado client‑side
- **Consent gate** antes de cargar scripts de ads/analytics

## Roadmap (v1+)
- Piecewise scales
- Drop‑lowest/recovery rules
- Optimizer
- A/B scenarios
- PDF export
- PWA/IndexedDB
- Advanced analytics
