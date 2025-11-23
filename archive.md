---
layout: default
title: Archive
permalink: /archive/
---

<div class="archive-container">
    <h1 class="archive-title">SYSTEM_LOGS</h1>
    <p style="color: var(--color-text-secondary); margin-bottom: 3rem; font-family: var(--font-mono);">
        // All transmissions from the Misaligned Codex.
    </p>

    <ul class="archive-list">
    {% for post in site.posts %}
        <li class="archive-item">
            <div class="archive-item-header">
                <h2 class="archive-item-title">
                    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                </h2>
                <time class="archive-item-date" datetime="{{ post.date | date_to_xmlschema }}">
                    {{ post.date | date: "%Y.%m.%d" }}
                </time>
            </div>
        </li>
    {% endfor %}
    </ul>
</div>
