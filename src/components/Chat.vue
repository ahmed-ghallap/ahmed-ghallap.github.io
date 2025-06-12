<script setup>
import { reactive , ref, nextTick } from 'vue'; // استيراد ref لإنشاء متغيرات تفاعلية
import Chat from '../modules/chat';

const messageContainer = ref(null)
const lastMessage = ref(null)

const scrollToLastMessage = () => {
  if (lastMessage.value) {
    lastMessage.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
};

const messages = reactive([])
const chatDb = new Chat();
chatDb.getAll().then((data) => {
  data.forEach((message) => {
    messages.push({
      id: message.id,
      content: message.content,
      owner: message.owner
    });
    nextTick(() => {
        scrollToLastMessage();
    });
  });
});


const message = ref(''); // متغير تفاعلي لتخزين النص المدخل من المستخدم
const addMessage = () => {
  if (message.value.trim() === '') return; // التحقق من أن الرسالة ليست فارغة
  messages.push({
    id: Date.now(), // استخدام الوقت الحالي كمعرف فريد
    content: message.value,
    owner: 'user' // تعيين المالك كـ 'user'
  });

  chatDb.add(message.value).then((botMessage) => {
    message.value = ''; // إعادة تعيين حقل الإدخال بعد الإرسال
    messages.push({
      id: Date.now() + 1, // استخدام وقت مختلف كمعرف فريد للرسالة من البوت
      content: botMessage,
      owner: 'bot' // تعيين المالك كـ 'bot'
    });
  }).catch((error) => {
    console.error('Error adding message:', error);
  });

  nextTick(() => {
      scrollToLastMessage();
  });
  
}

</script>



<template>
  <div class="p-4 pt-5 pb-3  h-[550px] flex flex-col justify-between bg-slate-300 ">

    <div :ref="messageContainer" class="messages-container hide-scrollbar self-grow flex flex-col gap-2 overflow-y-scroll">
      <div dir="auto" class="message" :class="message.owner+'-message'" 
        v-for="(message, index) in messages" 
        :key="index"
        :ref="index === messages.length - 1 ? 'lastMessage' : null"
      >
        {{ message.content }}
      </div>
    </div>

    <div 
    dir="ltr"
    class="
      message-input
      flex-none
      w-full
      flex items-center gap-3 
      h-max
      pt-3
    ">
      <button>
        <svg class="fill-slate-600" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36.2428 17.7678C36.2392 18.2619 36.0769 18.7417 35.7798 19.1364C35.4827 19.5311 35.0666 19.8198 34.5928 19.96L34.5636 19.9687L23.1646 23.1604L19.9729 34.5594L19.9641 34.5887C19.8238 35.0623 19.535 35.4783 19.1404 35.7754C18.7457 36.0724 18.266 36.2348 17.772 36.2386H17.7282C17.2438 36.2431 16.7703 36.0949 16.3749 35.815C15.9796 35.535 15.6825 35.1377 15.5258 34.6793L5.99162 8.97455C5.98853 8.96697 5.98609 8.95915 5.98431 8.95116C5.84183 8.53734 5.81835 8.09184 5.91654 7.66533C6.01474 7.23882 6.23067 6.84843 6.53976 6.53858C6.84886 6.22872 7.23871 6.01184 7.66497 5.91259C8.09124 5.81335 8.5368 5.83573 8.95097 5.9772L8.97436 5.98451L34.6835 15.5217C35.149 15.6808 35.5514 15.9846 35.8319 16.3887C36.1125 16.7928 36.2564 17.2761 36.2428 17.7678Z" fill="currenColor"/>
        </svg>
      </button>

      <form @submit.prevent="addMessage" class="w-full caret-transparent" >
        <input v-model="message" class="bg-white w-full rounded-lg h-[2.2rem] ps-2 outline-0 border-0 caret-slate-600" dir="auto" >
      </form>
    </div>
  </div>

</template>


<style scoped>
@reference "tailwindcss";

.message {
  @apply bg-orange-200 rounded-lg p-2 max-w-[90%] min-w-[20%] w-fit;
}
.user-message {
  @apply self-start bg-blue-200;
}
.bot-message {
  @apply self-end bg-green-200;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari, Opera*/
}
</style>