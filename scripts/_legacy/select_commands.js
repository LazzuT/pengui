const fs = require('fs');
const path = require('path');

const targetCount = 300;
const commandsPath = path.join(__dirname, '../data/commands.json');
const currentData = JSON.parse(fs.readFileSync(commandsPath, 'utf-8'));

const existingSlugs = new Set(currentData.map(c => c.slug.toLowerCase()));
const existingCmds = new Set(currentData.map(c => c.command.toLowerCase()));

console.log("Mevcut komut sayısı:", currentData.length);

const mainList = `
locate updatedb realpath readlink findmnt mountpoint install truncate sync pathchk 
column comm join nl fmt fold expand unexpand rev strings iconv split csplit od hexdump xxd printf look
pgrep pkill pstree wait timeout setsid taskset chrt pidof screen tmux
host traceroute tracepath mtr nc ncat telnet ftp sftp ssh-copy-id ssh-keygen ssh-agent ssh-add route arp arping tcpdump nmap whois
vmstat iostat iotop mpstat sar dstat atop glances watch lsof fuser pmap slabtop
userdel usermod groupadd groupdel groupmod groups id newgrp chage gpasswd who w last lastlog loginctl
systemctl journalctl service systemd-analyze systemd-run hostnamectl timedatectl localectl dmesg
crontab cron at atq atrm batch
apt-cache apt-file dpkg-reconfigure yum zypper flatpak snap
gunzip bunzip2 unxz zcat bzcat xzcat 7z 7za 7zr ar cpio
fsck e2fsck resize2fs tune2fs dumpe2fs wipefs mkfs.ext4 mkfs.xfs mkfs.vfat badblocks hdparm smartctl
alias unalias which whereis type env printenv export unset source exec set xargs tee yes clear reset script scriptreplay rsync
`.trim().split(/\s+/).filter(x => x);

const backupList = `
patch cmp diff3 tsort shuf seq factor numfmt base64 md5sum sha1sum sha256sum sha512sum cksum sum hostid arch nproc getconf ulimit time statx dos2unix unix2dos logger mesg wall write chfn chsh finger getent nohup stdbuf sponge timeout tac dircolors locale localedef hostname who users groups uptime
`.trim().split(/\s+/).filter(x => x);

const extraToHit300 = `
pr passwd chroot pwck grpck getfacl setfacl chattr lsattr umask zsh bash 
fish ksh dash tcsh csh zgrep zless zmore xargs envsubst tput 
fold m4 bc dc expr cal ncal strace ltrace
mtr iftop tc qdisc iwconfig iw nmcli nmtui ipcalc
iw dev macchanger
`.trim().split(/\s+/).filter(x => x);

let needed = targetCount - currentData.length;
const selectedNew = [];

function tryAdd(list) {
    for (const cmd of list) {
        if (needed === 0) break;
        const cleaned = cmd.toLowerCase().trim();
        if (!existingSlugs.has(cleaned) && !existingCmds.has(cleaned) && !selectedNew.includes(cleaned)) {
            selectedNew.push(cleaned);
            needed--;
        }
    }
}

tryAdd(mainList);
console.log("After Main List needed:", needed);
tryAdd(backupList);
console.log("After Backup List needed:", needed);
tryAdd(extraToHit300);
console.log("After Extra List needed:", needed);

console.log("Selected exactly:", selectedNew.length);
fs.writeFileSync(path.join(__dirname, 'selectedNew.json'), JSON.stringify(selectedNew, null, 2));
