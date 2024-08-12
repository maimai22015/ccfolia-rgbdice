// ==UserScript==
// @name         ccfolia-rgb-dice
// @namespace    http://tampermonkey.net/
// @version      0.1b
// @description  ccfolia.comで3d256/3b256を振った時にカラーコードを表示させる。 use with geminiAI
// @author       maimai@ytpmv.info
// @match        https://ccfolia.com/rooms/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    // 3つのクラスをすべて持つ要素を取得する関数
    function getTargetElements() {
        return document.querySelectorAll('.MuiTypography-root.MuiTypography-body2.MuiListItemText-secondary');
    }

    function logElements(elements) {
        elements.forEach((element, index) => {
            if (element.innerHTML.startsWith('3d256') || element.innerHTML.startsWith('3D256')) {
                // for debug
                // console.log(`要素${index + 1}:`, element);
                // console.log('textContent:', element.textContent);
                // console.log('innerHTML:', element.innerHTML);


                // 子要素をすべて取得し、色を変更
                const childElements = element.querySelectorAll('*');
                childElements.forEach(child => {
                let isProcessed = false; // 各要素が処理済みかどうかを管理するフラグ

                // 子要素のtextContentから"[]"内の文字列を抽出・分割
                const textContent = child.textContent;
                const matches = textContent.matchAll(/\[(.*?)\]/g);

                for (const match of matches) {
                    const extractedText = match[1];
                    const items = extractedText.split(',').map(Number); // 文字列を数値に変換
                    const hexValues = items.map(num => num.toString(16).padStart(2, '0')); // 16進数に変換し、2桁にゼロ埋め
                    const colorCode = `#${hexValues.join('')}`; // 色コードを作成

                    // Observerを一時停止
                    observer.disconnect();

                    if (!child.dataset.processed) { // 処理済みフラグをチェック
                        // 子要素の最後にspan要素を作成し、色コードを表示
                        const colorSpan = document.createElement('span');
                        colorSpan.textContent = `\n■ ${colorCode}`;
                        child.appendChild(colorSpan);

                        // 処理済みフラグを設定
                        child.dataset.processed = true;
                    }
                    child.style.color=colorCode;

                    // Observerを再開
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                };
            });
        }

        if (element.innerHTML.startsWith('3b256') || element.innerHTML.startsWith('3B256')) {

            // 子要素をすべて取得し、色を変更
            const childElements = element.querySelectorAll('*');
            childElements.forEach(child => {
            let isProcessed = false; // 各要素が処理済みかどうかを管理するフラグ

            // 子要素のtextContentから"[]"内の文字列を抽出・分割
            const textContent = child.textContent;
            const extractedText = textContent.split(" ＞ ")[1];
            if(extractedText==undefined){
                return;
            }
            const items = extractedText.split(',').map(Number); // 文字列を数値に変換
            const hexValues = items.map(num => num.toString(16).padStart(2, '0')); // 16進数に変換し、2桁にゼロ埋め
            const colorCode = `#${hexValues.join('')}`; // 色コードを作成

            // Observerを一時停止
            observer.disconnect();

            if (!child.dataset.processed) { // 処理済みフラグをチェック
                // 子要素の最後にspan要素を作成し、色コードを表示
                const colorSpan = document.createElement('span');
                colorSpan.textContent = `\n■ ${colorCode}`;
                child.appendChild(colorSpan);

                // 処理済みフラグを設定
                child.dataset.processed = true;
                
            }
            child.style.color=colorCode;

            // Observerを再開
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
        });
    }

    // 初期取得
    const targetElements = getTargetElements();
    logElements(targetElements);

    // DOMの変更を監視
    const observer = new MutationObserver(mutationsList => {
        // 変更があった場合、要素を再取得して表示
        const newElements = getTargetElements();
        logElements(newElements);
    });


    // 監視対象と設定を指定
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
